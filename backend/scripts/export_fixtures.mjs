// Exports the frontend's content fixtures to backend/content/content.json for the importer.
//
//   node --experimental-strip-types backend/scripts/export_fixtures.mjs
//
// Run from the repository root. Topic assignments are computed with the frontend's own
// rules (src/data/topics.ts), so the imported dossier_categories match what the site shows.

import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..")
const load = path => import(pathToFileURL(resolve(root, path)).href)

const { ARTICLES } = await load("src/data/fixtures/articles.ts")
const { ARTICLE_SECTIONS } = await load("src/data/fixtures/articleSections.ts")
const { AUTHORS } = await load("src/data/fixtures/authors.ts")
const { ISSUES } = await load("src/data/fixtures/issues.ts")
const { TOPICS, ALL_TOPIC_ID } = await load("src/data/topics.ts")

// Only public profile fields: author emails stay out of the API
const authors = AUTHORS.map(a => ({
  id: a.id,
  name: a.name,
  role: a.role,
  company: a.company,
  bio: a.bio,
  photo: a.photo,
  linkedin: a.linkedin ?? null,
  expertise: a.expertise ?? [],
  credentials: a.credentials ?? null,
  location: a.location ?? null,
  isContributor: a.isContributor,
}))

const issues = ISSUES.map(i => ({
  id: i.id,
  number: i.number,
  volume: i.volume,
  month: i.month,
  theme: i.theme,
  summary: i.summary,
  coverImage: i.coverImage,
  status: i.status,
  editorialColumn: i.editorialColumn ?? null,
  macroSignals: i.macroSignals ?? null,
  readersCount: i.readersCount ?? null,
}))

const dossiers = ARTICLES.map(a => ({
  slug: a.slug,
  title: a.title,
  dek: a.dek,
  category: a.category,
  format: a.format,
  issueId: a.issueId,
  authorId: a.authorId,
  date: a.date,
  readingTime: a.readingTime,
  tags: a.tags,
  image: a.image,
  body: a.body,
  isLocked: Boolean(a.isLocked),
  references: a.references ?? [],
  sections: ARTICLE_SECTIONS[a.slug] ?? [],
  topics: TOPICS.filter(t => t.id !== ALL_TOPIC_ID && t.matches(a)).map(t => t.id),
}))

const out = resolve(root, "backend", "content", "content.json")
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify({ authors, issues, dossiers }, null, 2) + "\n")
console.log(`wrote ${out}: ${authors.length} authors, ${issues.length} issues, ${dossiers.length} dossiers`)
