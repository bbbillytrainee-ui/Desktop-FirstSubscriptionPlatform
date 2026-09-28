import { useMemo, useState, type CSSProperties } from "react"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import TaxonomyNav from "./layout/TaxonomyNav"
import Button from "./ui/Button"
import Badge from "./ui/Badge"
import ArticleCard from "./magazine/ArticleCard"
import MagazineFlipbook from "./magazine/LazyMagazineFlipbook"
import LastMonthTrending from "./magazine/LastMonthTrending"
import LatestNewsSidebar from "./news/LatestNewsSidebar"
import Card from "./ui/Card"
import SectionHeader from "./ui/SectionHeader"
import TextLink from "./ui/TextLink"
import Avatar from "./ui/Avatar"
import EmptyState from "./ui/EmptyState"
import Reveal from "./ui/Reveal"
import Hero from "./home/Hero"
import ChapterRail from "./layout/ChapterRail"
import CountUp from "./ui/CountUp"
import SafeImage from "./ui/SafeImage"
import { ARTICLES, Article } from "../data/fixtures/articles"
import { ISSUES, Issue } from "../data/fixtures/issues"
import { PROFILES } from "../data/fixtures/profiles"
import { WEBINARS } from "../data/fixtures/webinars"
import { RESEARCH_REPORTS } from "../data/fixtures/reports"
import { TOPICS, ALL_TOPIC_ID, filterByTopic, getTopic, readTopicFromUrl, writeTopicToUrl } from "../data/topics"
import { withViewTransition, prefersReducedMotion } from "../lib/motion"
import { articleRoute } from "../lib/router"

const VERTICALS = [
  {
    topicId: "pharma",
    short: "Pharma",
    label: "Pharma & Biologics",
    title: "Drug Discovery & Regulatory Submissions",
    description: "CDSCO clinical guidance, oncology HEOR evidence, biosimilars scale-up, and regional drug pricing dynamics.",
  },
  {
    topicId: "medtech",
    short: "MedTech",
    label: "MedTech & Diagnostics",
    title: "Device Engineering & Cross-Border IP",
    description: "Surgical robotics licensing, point-of-care diagnostics, precision hardware, and supply chain integrity.",
  },
  {
    topicId: "ai-health",
    short: "AI-Health",
    label: "AI & Digital Health",
    title: "SaMD Validation & Automated Safety",
    description: "Clinical AI trial design, NLP pharmacovigilance pipelines, synthetic controls, and health data governance.",
  },
]

const JOIN_BENEFITS = [
  { title: "The monthly issue", body: "Dossiers, columns and the 3D flipbook edition, the first week of every month." },
  { title: "The morning dispatch", body: "Regulatory and deal alerts at 8:00 AM, with sources you can cite." },
  { title: "Explainable introductions", body: "Peer matches with the reason shown, made only with both sides' consent." },
]

const JOIN_AVATARS = [
  { initials: "DR", bg: "bg-teal-600" },
  { initials: "AP", bg: "bg-terracotta-600" },
  { initials: "SK", bg: "bg-teal-500" },
  { initials: "VS", bg: "bg-sand-700" },
]

export interface LandingProps {
  onGetAccess: () => void
  onNavigate?: (route: string) => void
}

export default function Landing({ onGetAccess, onNavigate }: LandingProps) {
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [activeFlipbookIssue, setActiveFlipbookIssue] = useState<Issue>(ISSUES[0])
  const [activeTopic, setActiveTopic] = useState(readTopicFromUrl)

  const currentIssue = ISSUES[0]
  const lastMonthIssue = ISSUES[1]
  const lastMonthArticles = ARTICLES.filter(a => a.issueId === lastMonthIssue.id)
  const nextWebinar = WEBINARS[0]

  const filteredArticles = filterByTopic(ARTICLES, activeTopic)
  const topicCounts = useMemo(
    () => Object.fromEntries(TOPICS.map(t => [t.id, filterByTopic(ARTICLES, t.id).length])),
    []
  )
  // Topics with an article in the 7 days up to the newest one get an "updated" dot
  const updatedTopics = useMemo(() => {
    const newest = Math.max(...ARTICLES.map(a => Date.parse(a.date)))
    const recent = ARTICLES.filter(a => newest - Date.parse(a.date) <= 7 * 86_400_000)
    return TOPICS.filter(t => t.id !== ALL_TOPIC_ID && recent.some(t.matches)).map(t => t.id)
  }, [])

  const openArticle = (article: Article) => onNavigate?.(articleRoute(article.slug))

  const selectTopic = (topicId: string, { scroll = true } = {}) => {
    writeTopicToUrl(topicId)
    withViewTransition(() => setActiveTopic(topicId))
    if (scroll) document.getElementById("articles-section")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
      {/* 3D Magazine Flipbook Modal */}
      {showFlipbook && (
        <MagazineFlipbook
          issue={activeFlipbookIssue}
          articles={
            ARTICLES.filter(a => a.issueId === activeFlipbookIssue.id).length > 0
              ? ARTICLES.filter(a => a.issueId === activeFlipbookIssue.id)
              : ARTICLES
          }
          onClose={() => setShowFlipbook(false)}
          onJoinPrompt={onGetAccess}
        />
      )}

      {/* Header */}
      <Header onJoin={onGetAccess} onSignIn={onGetAccess} onNavigate={onNavigate} />

      {/* Taxonomy Filter Bar (Top Sub-Nav) */}
      <TaxonomyNav activeTopic={activeTopic} counts={topicCounts} updated={updatedTopics} onSelectTopic={id => selectTopic(id)} />

      <main id="main-content">
      {/* SECTION 1: Hero */}
      <Hero
        issue={currentIssue}
        onJoin={onGetAccess}
        onOpenIssue={() => setShowFlipbook(true)}
        onArchive={() => onNavigate?.("archive")}
      />

      {/* SECTION 3: Newspaper Editorial Grid (Lead Dossier + Live Breaking Sidebar + 3 Sub-Features) */}

      <section id="articles-section" data-chapter="Dossiers" className="py-[var(--section-y)] px-6 md:px-12 border-b border-[var(--border-subtle)] bg-card">
        <div className="max-w-[var(--container-max)] mx-auto">
          
          <SectionHeader
            index="01"
            eyebrow="Editorial Exclusives"
            title="Latest Life Science Dossiers"
            description="Long-form analysis from this month's issue, plus the wire as it lands."
            action={
              <span className="flex items-center gap-5">
                {activeTopic !== ALL_TOPIC_ID && (
                  <TextLink tone="muted" arrow={false} onClick={() => selectTopic(ALL_TOPIC_ID, { scroll: false })}>
                    Show all topics
                  </TextLink>
                )}
                <TextLink onClick={() => onNavigate?.("magazine")}>View all dossiers</TextLink>
              </span>
            }
          />

          {/* Top Row: Hero Article (7 cols) + Live Breaking Feed Sidebar (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            <div data-reveal="up" className="lg:col-span-8">
              {filteredArticles.length > 0 ? (
                <ArticleCard
                  article={filteredArticles[0]}
                  variant="hero"
                  onClick={() => openArticle(filteredArticles[0])}
                />
              ) : (
                <EmptyState
                  className="h-full"
                  title={`No ${getTopic(activeTopic).label} dossiers yet`}
                  description="We haven't published in this topic this month. Browse everything we cover, or check the archive for past editions."
                  actionLabel="Show all topics"
                  onAction={() => selectTopic(ALL_TOPIC_ID, { scroll: false })}
                  secondaryActionLabel="Browse the archive"
                  onSecondaryAction={() => onNavigate?.("archive")}
                />
              )}
            </div>

            <div data-reveal="right" style={{ "--i": 2 } as CSSProperties} className="lg:col-span-4">
              <LatestNewsSidebar onSubscribe={onGetAccess} />
            </div>
          </div>

          {/* Hierarchy: 1 featured (above) → 2 medium, horizontal from sm → compact thumbnail rows */}
          {filteredArticles.length > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-8 border-t border-[var(--color-border-subtle)] mb-8">
              {filteredArticles.slice(1, 3).map((article, i) => (
                <Reveal key={article.slug} delay={i * 120} className="h-full">
                  <ArticleCard article={article} variant="medium" onClick={() => openArticle(article)} />
                </Reveal>
              ))}
            </div>
          )}

          {filteredArticles.length > 3 && (
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 mb-12 border-t border-[var(--color-border-subtle)]">
              {filteredArticles.slice(3, 7).map((article, i) => (
                <li key={article.slug} data-reveal="up" style={{ "--i": i } as CSSProperties} className="py-3 border-b border-[var(--color-border-subtle)]">
                  <ArticleCard article={article} variant="compact" onClick={() => openArticle(article)} />
                </li>
              ))}
            </ul>
          )}

          {/* Dedicated Last Month's Trending Retrospective */}
          {lastMonthIssue && (
            <Reveal variant="scale">
            <LastMonthTrending
              lastMonthIssue={lastMonthIssue}
              lastMonthArticles={lastMonthArticles}
              onSelectArticle={openArticle}
              onOpenIssueFlipbook={issue => {
                setActiveFlipbookIssue(issue)
                setShowFlipbook(true)
              }}
            />
            </Reveal>
          )}

        </div>
      </section>

      {/* SECTION 4: Three-Lane Focus Areas (Pharma, MedTech, AI) - Dark Mode Island */}
      <section id="coverage" data-chapter="Coverage" data-chapter-dark className="band-glow band-open py-[var(--section-y)] px-6 md:px-12 bg-[var(--color-section-dark)] text-white relative overflow-clip">
        <div className="max-w-[var(--container-max)] mx-auto relative z-10">
          <SectionHeader
            index="02"
            eyebrow="Core Coverage"
            title="Three verticals. Focused depth."
            description="Uncompromising monthly analysis written for decision-makers in medicine, biotechnology, and health technology."
            align="center"
            tone="dark"
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERTICALS.map((v, i) => (
              <Reveal key={v.topicId} delay={120 + i * 120} className="h-full">
              <button
                type="button"
                onClick={() => selectTopic(v.topicId)}
                className="group text-left p-6 bg-[var(--color-navy-deep)] border border-white/10 rounded-card hover:border-[var(--color-brand-coral-on-dark)]/60 transition-colors flex flex-col justify-between w-full h-full"
              >
                <div>
                  <span className="block mb-3 font-mono text-meta font-semibold uppercase tracking-wider text-[var(--color-brand-coral-on-dark)]">
                    0{i + 1} / {v.label}
                  </span>
                  <h3 className="font-serif text-h3 font-semibold text-white mb-3">{v.title}</h3>
                  <p className="text-sm text-sand-300 leading-relaxed mb-6">{v.description}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-meta font-semibold text-[var(--color-brand-coral-on-dark)] group-hover:text-white transition-colors">
                  Explore {v.short} coverage
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Webinar Spotlight + Verified Network Teaser (page tone: rhythm is page / white / teal) */}
      <section id="network" data-chapter="Network" className="band-open py-[var(--section-y)] px-6 md:px-12 bg-[var(--surface-tint)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Col (5 cols): Upcoming Webinar */}
            <Reveal variant="left" className="lg:col-span-5">
            <Card padding="lg" className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
                  <span className="font-mono text-eyebrow font-semibold uppercase text-[var(--color-brand-coral)]">
                    Upcoming Masterclass
                  </span>
                  <span className="font-mono text-meta text-[var(--color-slate-muted)]">{nextWebinar.date}</span>
                </div>

                <h3 className="font-serif text-h3 font-semibold text-[var(--color-ink)] mb-2">{nextWebinar.title}</h3>
                <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-5">{nextWebinar.description}</p>

                <div className="flex items-center gap-3 mb-5">
                  <Avatar name={nextWebinar.speaker} size="sm" />
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-ink)]">{nextWebinar.speaker}</div>
                    <div className="text-meta text-[var(--color-slate-muted)]">
                      {nextWebinar.speakerRole}, {nextWebinar.speakerCompany}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
                <Button variant="coral" size="sm" onClick={() => (onNavigate ? onNavigate("webinars") : onGetAccess())}>
                  Reserve a seat
                </Button>
                <TextLink tone="muted" onClick={() => onNavigate?.("webinars")}>
                  All webinars
                </TextLink>
              </div>
            </Card>
            </Reveal>

            {/* Right Col (7 cols): Verified Network Introductions */}
            <Reveal variant="right" delay={120} className="lg:col-span-7">
              <SectionHeader
                as="h3"
                index="03"
                eyebrow="Verified Network"
                title="Connect with leaders across the ecosystem"
                action={<TextLink onClick={onGetAccess} className="hidden sm:inline-flex">Explore the member directory</TextLink>}
                className="mb-5"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROFILES.slice(0, 2).map(p => (
                  <Card key={p.id} className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={p.name} size="sm" />
                        <div>
                          <h4 className="text-sm font-semibold text-[var(--color-ink)]">{p.name}</h4>
                          <p className="text-meta text-[var(--color-slate-muted)]">{p.title} · {p.org}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-3">{p.bio}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-[var(--color-border-subtle)]">
                      {p.tags.slice(0, 2).map(t => (
                        <span
                          key={t}
                          className="font-mono text-meta px-2 py-0.5 bg-card text-[var(--color-ink)] rounded-control border border-[var(--color-border-subtle)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-4 px-4 py-3 bg-card border border-[var(--color-border-subtle)] rounded-card flex items-center justify-between gap-4 text-meta">
                <span className="text-[var(--color-slate-muted)]">
                  DPDP Act 2023 compliant · Introductions only with explicit consent
                </span>
                <TextLink onClick={onGetAccess} className="shrink-0">Join the directory</TextLink>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* SECTION 6: Institutional Dossiers / Research Reports */}
      <section id="briefings" data-chapter="Briefings" className="py-[var(--section-y)] px-6 md:px-12 bg-[var(--surface-page)] border-t border-[var(--border-subtle)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <SectionHeader
            index="04"
            eyebrow="Institutional Intelligence"
            title="Deep Industry Briefings & Dossiers"
            description="Board-ready research with executive summaries, sourced data and regulatory timelines."
            action={<TextLink onClick={() => onNavigate?.("reports")}>View all reports</TextLink>}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESEARCH_REPORTS.map((rep, i) => (
              <Reveal key={rep.id} variant="scale" delay={i * 120} className="h-full">
              <Card padding="lg" interactive className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between font-mono text-meta text-[var(--color-slate-muted)] mb-2">
                    <span className="uppercase font-semibold text-[var(--color-brand-teal)]">{rep.category}</span>
                    <span>{rep.pagesCount} pages</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)] mb-2 leading-snug">{rep.title}</h3>
                  <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-4 line-clamp-3">
                    {rep.executiveSummary}
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <span className="font-mono text-meta font-semibold text-[var(--color-ink)]">
                    {rep.price} <span className="font-normal text-[var(--color-slate-muted)]">· free with Pro</span>
                  </span>
                  <TextLink onClick={() => (onNavigate ? onNavigate("reports") : onGetAccess())}>View dossier</TextLink>
                </div>
              </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Join the network — deep teal band, split layout (pitch left, what you get right) */}
      <section id="join" data-chapter="Join" data-chapter-dark aria-labelledby="join-title" className="join-band band-open relative overflow-clip px-6 md:px-12 py-[var(--section-y)] text-[var(--text-inverse)]">
        <div className="relative z-10 max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-16 items-center">
          <div>
            <p data-reveal="up" className="mb-5 flex items-center gap-3 font-mono text-label font-semibold uppercase text-[var(--accent-on-inverse)]">
              <span className="tabular-nums text-[var(--premium-on-inverse)]"><span className="sr-only">Section </span>05</span>
              <span aria-hidden="true" data-reveal="rule" style={{ "--i": 2 } as CSSProperties} className="h-px w-8 bg-[var(--accent-on-inverse)]" />
              Join Mediverse Life Sciences
            </p>
            <h2 id="join-title" data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="font-serif text-h1 font-semibold text-white mb-5 [text-wrap:balance]">
              The publication <span className="font-normal italic text-[var(--accent-on-inverse)]">&amp;</span> network for healthcare decision-makers.
            </h2>
            <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="text-deck text-[var(--text-inverse-muted)] mb-8 max-w-[52ch]">
              Curated monthly dossiers, interactive 3D editions, and explainable peer introductions across Pharma, MedTech, and AI-Health.
            </p>
            <div data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <Button variant="coral" size="lg" arrow onClick={onGetAccess}>
                Join the network
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onNavigate?.("subscriptions")}
                className="text-white border border-white/25 hover:bg-white/10"
              >
                View membership plans
              </Button>
            </div>

            <div data-reveal="up" style={{ "--i": 4 } as CSSProperties} className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2" aria-hidden="true">
                {JOIN_AVATARS.map(a => (
                  <span
                    key={a.initials}
                    className={`w-9 h-9 rounded-full border-2 border-[var(--surface-inverse)] flex items-center justify-center font-mono text-[11px] font-semibold text-white ${a.bg}`}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <p className="text-caption text-[var(--text-inverse-muted)]">
                <span className="font-semibold text-white tabular-nums">34,000+</span> verified leaders read every issue
              </p>
            </div>
          </div>

          {/* What membership includes: numbered list on a raised inverse panel */}
          <ol data-reveal="right" style={{ "--i": 1 } as CSSProperties} className="rounded-overlay border border-[var(--border-inverse)] bg-[var(--surface-inverse-raised)] divide-y divide-[var(--border-inverse)] shadow-overlay">
            {JOIN_BENEFITS.map((item, i) => (
              <li key={item.title} data-reveal="up" style={{ "--i": i + 3 } as CSSProperties} className="flex gap-5 p-6">
                <span className="font-mono text-label font-semibold text-[var(--premium-on-inverse)] pt-1 tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-h4 font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-inverse-muted)]">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      </main>

      <ChapterRail />

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
