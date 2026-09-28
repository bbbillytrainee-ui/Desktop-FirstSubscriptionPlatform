import { useEffect, useState } from "react"
import { prefersReducedMotion } from "../../lib/motion"

interface Chapter {
  id: string
  label: string
  dark: boolean
}

/**
 * Magazine-style chapter rail (xl+): one tick per `section[data-chapter][id]` on the page.
 * The tick of the section in the middle of the viewport grows and shows its number; hovering
 * the rail reveals every label. Inverts over sections marked `data-chapter-dark`.
 */
export default function ChapterRail() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-chapter][id]")]
    setChapters(sections.map(el => ({ id: el.id, label: el.dataset.chapter ?? el.id, dark: el.hasAttribute("data-chapter-dark") })))
    // a section is "current" while it crosses the middle band of the viewport
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    sections.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (chapters.length < 2) return null
  const onDark = chapters.find(c => c.id === active)?.dark ?? false

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  return (
    <nav aria-label="Page sections" className={`chapter-rail hidden xl:block ${onDark ? "is-on-dark" : ""}`}>
      <ol>
        {chapters.map((c, i) => {
          const number = i === 0 ? "" : String(i).padStart(2, "0")
          const isActive = c.id === active
          return (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={e => go(e, c.id)} aria-current={isActive ? "true" : undefined} className="chapter-link">
                <span className="chapter-label">
                  {number && <span className="chapter-label-num">{number}</span>}
                  {c.label}
                </span>
                <span aria-hidden="true" className="chapter-num">{number}</span>
                <span aria-hidden="true" className="chapter-tick" />
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
