import { toneFor } from "../../data/topics"

export interface TopicChipProps {
  /** Article or feed category; picks the colour family (pharma teal, regulatory terracotta, medtech indigo, AI olive) */
  category: string
  /** Visible text; defaults to the category */
  label?: string
  className?: string
}

/** Colour-coded category pill. Inside a `.group`, hovering the group deepens the fill and grows the dot. */
export default function TopicChip({ category, label = category, className = "" }: TopicChipProps) {
  return (
    <span data-tone={toneFor(category)} className={`topic-chip ${className}`}>
      <span aria-hidden="true" className="topic-chip-dot" />
      {label}
    </span>
  )
}
