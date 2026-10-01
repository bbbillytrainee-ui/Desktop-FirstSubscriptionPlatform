"""add email_send_log table

Revision ID: 0002
Revises: 0f371ba34bfc
Create Date: 2026-09-29 12:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: str | None = "0f371ba34bfc"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "email_send_log",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("send_date", sa.Date(), nullable=False),
        sa.Column("count", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_email_send_log")),
        sa.UniqueConstraint("send_date", name=op.f("uq_email_send_log_send_date")),
    )
    op.execute(
        "INSERT INTO email_send_log (send_date, count) VALUES (CURRENT_DATE, 0) ON CONFLICT DO NOTHING"
    )


def downgrade() -> None:
    op.drop_table("email_send_log")
