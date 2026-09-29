"""Import authors, issues and dossiers from a JSON file into the database in DATABASE_URL.

    uv run python -m scripts.import_content                     # content/content.json
    uv run python -m scripts.import_content path/to/file.json --dry-run
    uv run python -m scripts.import_content --allow-production  # when ENV=production

This is how content reaches production for now (there is no admin UI for dossiers/issues). It is
idempotent (upsert by slug), never deletes, and runs in a single transaction.
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path

from pydantic import ValidationError

from app.config import get_settings
from app.db import dispose_engine, get_sessionmaker
from app.importer import ContentImportError, import_content

DEFAULT_FILE = Path(__file__).resolve().parent.parent / "content" / "content.json"


async def run(data: dict, *, dry_run: bool) -> int:
    async with get_sessionmaker()() as session:
        try:
            report = await import_content(session, data)
        except (ValidationError, ContentImportError) as exc:
            await session.rollback()
            print(f"Import aborted, nothing was written:\n{exc}", file=sys.stderr)
            return 1
        if dry_run:
            await session.rollback()
            print("Dry run (rolled back): " + report.summary())
        else:
            await session.commit()
            print(report.summary())
    await dispose_engine()
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("file", nargs="?", type=Path, default=DEFAULT_FILE)
    parser.add_argument("--dry-run", action="store_true", help="validate and report, then roll back")
    parser.add_argument(
        "--allow-production", action="store_true", help="required when ENV=production (deliberate step)"
    )
    args = parser.parse_args()

    settings = get_settings()
    if settings.is_production and not args.allow_production:
        print("ENV=production: re-run with --allow-production to import into production.", file=sys.stderr)
        return 2
    data = json.loads(args.file.read_text(encoding="utf-8"))
    return asyncio.run(run(data, dry_run=args.dry_run))


if __name__ == "__main__":
    sys.exit(main())
