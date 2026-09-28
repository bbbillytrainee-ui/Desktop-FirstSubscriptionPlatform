import type { Article } from "./fixtures/articles"

export interface Topic {
  id: string
  label: string
  matches: (article: Article) => boolean
}

const tagMatch = (pattern: RegExp) => (a: Article) => a.tags.some(t => pattern.test(t))

export const ALL_TOPIC_ID = "all"

export const TOPICS: Topic[] = [
  { id: ALL_TOPIC_ID, label: "All Intelligence", matches: () => true },
  { id: "pharma", label: "Pharma & Biologics", matches: a => a.category === "Pharma" },
  { id: "regulatory", label: "Regulatory & CDSCO", matches: tagMatch(/regulat|samd|compliance|pharmacovigilance|post-market|dpdp/i) },
  { id: "medtech", label: "MedTech & Robotics", matches: a => a.category === "MedTech" },
  { id: "ai-health", label: "AI & Digital Health", matches: a => a.category === "AI-Health" },
  { id: "clinical", label: "Clinical Operations", matches: tagMatch(/clinical|trial|protocol|econsent|direct-to-patient/i) },
  { id: "supply-chain", label: "Supply Chain & Logistics", matches: tagMatch(/supply|cold-chain|logistics|cdmo|manufacturing|bioprocess|containment/i) },
  { id: "market-access", label: "Market Access & HEOR", matches: tagMatch(/heor|reimbursement|market access|pricing|commercial|licensing/i) },
]

/** Colour family for chips and feed rails (tokens: --topic-<tone>-fg/bg/bg-strong/rail) */
export type TopicTone = "pharma" | "regulatory" | "medtech" | "ai"

const CATEGORY_TONES: Record<string, TopicTone> = {
  Pharma: "pharma",
  MedTech: "medtech",
  "AI-Health": "ai",
  // Speed Feed categories
  "Drug Approvals": "regulatory",
  "CDSCO & Policy": "regulatory",
  Biotech: "pharma",
  "Commercial BD": "pharma",
  "Cold Chain": "medtech",
}

export const toneFor = (category: string): TopicTone => CATEGORY_TONES[category] ?? "pharma"

export const getTopic =(id: string | null | undefined): Topic =>
  TOPICS.find(t => t.id === id) ?? TOPICS[0]

export const filterByTopic = (articles: Article[], topicId: string) =>
  articles.filter(getTopic(topicId).matches)

/** Reads ?topic= from the URL; unknown values fall back to "all". */
export const readTopicFromUrl = (): string =>
  typeof window === "undefined" ? ALL_TOPIC_ID : getTopic(new URLSearchParams(window.location.search).get("topic")).id

/** Keeps ?topic= in sync without adding history entries. */
export const writeTopicToUrl = (topicId: string) => {
  const url = new URL(window.location.href)
  if (topicId === ALL_TOPIC_ID) url.searchParams.delete("topic")
  else url.searchParams.set("topic", topicId)
  window.history.replaceState(window.history.state, "", url)
}
