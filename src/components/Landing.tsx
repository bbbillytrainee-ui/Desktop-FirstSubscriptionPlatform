import { useMemo, useState, type CSSProperties } from "react"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import Button from "./ui/Button"
import Badge from "./ui/Badge"
import ArticleCard from "./magazine/ArticleCard"
import DossierRail from "./magazine/DossierRail"
import MagazineFlipbook from "./magazine/LazyMagazineFlipbook"
import LastMonthTrending from "./magazine/LastMonthTrending"
import ContinueReading from "./magazine/ContinueReading"
import LatestNewsSidebar from "./news/LatestNewsSidebar"
import Card from "./ui/Card"
import SectionHeader from "./ui/SectionHeader"
import TextLink from "./ui/TextLink"
import Avatar from "./ui/Avatar"
import EmptyState from "./ui/EmptyState"
import Reveal from "./ui/Reveal"
import Hero from "./home/Hero"
import CoverageStory from "./home/CoverageStory"
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
    category: "Pharma",
    short: "Pharma",
    label: "Pharma & Biologics",
    title: "Drug Discovery & Regulatory Submissions",
    description: "CDSCO clinical guidance, oncology HEOR evidence, biosimilars scale-up, and regional drug pricing dynamics.",
  },
  {
    topicId: "medtech",
    category: "MedTech",
    short: "MedTech",
    label: "MedTech & Diagnostics",
    title: "Device Engineering & Cross-Border IP",
    description: "Surgical robotics licensing, point-of-care diagnostics, precision hardware, and supply chain integrity.",
  },
  {
    topicId: "ai-health",
    category: "AI-Health",
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

      <main id="main-content">
      {/* SECTION 1: Hero */}
      <Hero
        issue={currentIssue}
        previousIssues={[ISSUES[1], ISSUES[2]]}
        onJoin={onGetAccess}
        onOpenIssue={(targetIssue) => {
          setActiveFlipbookIssue(targetIssue ?? currentIssue)
          setShowFlipbook(true)
        }}
        onArchive={() => onNavigate?.("archive")}
        notice={<ContinueReading onOpen={openArticle} />}
      />

      {/* SECTION 3: Newspaper Editorial Grid (Lead Dossier + Live Breaking Sidebar + 3 Sub-Features) */}

      <section id="articles-section" data-chapter="Dossiers" data-scene="white" className="py-[var(--section-y)] px-6 md:px-12">
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

          {/* Topic Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none [mask-image:linear-gradient(to_right,#000_calc(100%-40px),transparent)]">
            {TOPICS.map(topic => {
              const isSelected = activeTopic === topic.id
              const count = topicCounts[topic.id]
              const isUpdated = updatedTopics.includes(topic.id)
              return (
                <button
                  key={topic.id}
                  type="button"
                  data-topic={topic.id}
                  aria-pressed={isSelected}
                  onClick={() => selectTopic(topic.id, { scroll: false })}
                  className={`relative px-4 py-2 whitespace-nowrap text-xs font-medium rounded-full cursor-pointer shrink-0 flex items-center gap-2 border transition-all duration-200 ${
                    isSelected
                      ? "bg-[var(--brand-text)] text-white font-semibold border-transparent shadow-md scale-[1.02]"
                      : "bg-[var(--surface-sunken)] hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border-[var(--border-subtle)]"
                  }`}
                >
                  <span>{topic.label}</span>
                  {count !== undefined && (
                    <span
                      className={`font-mono text-[11px] tabular-nums px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-white/20 text-white font-bold" : "bg-[var(--border-subtle)] text-[var(--text-muted)]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                  {isUpdated && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-decor)] animate-pulse" title="Updated this week" />
                  )}
                </button>
              )
            })}
          </div>

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

          {/* The rest of the issue as one swipeable row (was 2 medium cards + 4 compact rows stacked) */}
          {filteredArticles.length > 1 && (
            <div data-reveal="up" className="mt-4 pt-12 md:pt-16 border-t border-[var(--border-subtle)]">
              <DossierRail
                articles={filteredArticles.slice(1)}
                onOpen={openArticle}
                onViewAll={() => onNavigate?.("magazine")}
                total={ARTICLES.length}
              />
            </div>
          )}
        </div>
      </section>

      {/* Last month's retrospective: its own chapter and scene */}
      {lastMonthIssue && (
        <section id="last-month" data-chapter="Last month" data-scene="light" className="py-[var(--section-y)] px-6 md:px-12 border-t border-[var(--border-subtle)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <LastMonthTrending
              index="02"
              lastMonthIssue={lastMonthIssue}
              lastMonthArticles={lastMonthArticles}
              onSelectArticle={openArticle}
              onOpenIssueFlipbook={issue => {
                setActiveFlipbookIssue(issue)
                setShowFlipbook(true)
              }}
            />
          </div>
        </section>
      )}

      {/* SECTION 4: Core Coverage — pinned carousel story (stacked on phones / reduced motion) */}
      <CoverageStory
        verticals={VERTICALS.map(v => ({
          ...v,
          count: topicCounts[v.topicId] ?? 0,
          image: ARTICLES.find(a => a.category === v.category)?.image ?? currentIssue.coverImage,
        }))}
        totalDossiers={topicCounts[ALL_TOPIC_ID] ?? ARTICLES.length}
        onSelectTopic={id => selectTopic(id)}
      />

      {/* SECTION 5: Webinar Spotlight + Verified Network Teaser (page tone: rhythm is page / white / teal) */}
      <section id="network" data-chapter="Network" data-scene="sand" className="py-[var(--section-y)] px-6 md:px-12">
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
                index="04"
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
      <section id="briefings" data-chapter="Briefings" data-scene="light" className="py-[var(--section-y)] px-6 md:px-12">
        <div className="max-w-[var(--container-max)] mx-auto">
          <SectionHeader
            index="05"
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
      <section id="join" data-chapter="Join" data-chapter-dark data-scene="dark" aria-labelledby="join-title" className="join-band relative overflow-clip px-6 md:px-12 py-[var(--section-y)]">
        <div className="relative z-10 max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 lg:gap-16 items-center">
          <div>
            <p data-reveal="up" className="mb-5 flex items-center gap-3 font-mono text-label font-semibold uppercase text-[var(--accent-text)]">
              <span className="tabular-nums text-[var(--premium-text)]"><span className="sr-only">Section </span>06</span>
              <span aria-hidden="true" data-reveal="rule" style={{ "--i": 2 } as CSSProperties} className="h-px w-8 bg-[var(--accent-decor)]" />
              Join Mediverse Life Sciences
            </p>
            <h2 id="join-title" data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="font-serif text-h1 font-semibold text-[var(--text-primary)] mb-5 [text-wrap:balance]">
              The publication <span className="font-normal italic text-[var(--accent-text)]">&amp;</span> network for healthcare decision-makers.
            </h2>
            <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="text-deck text-[var(--text-muted)] mb-8 max-w-[52ch]">
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
                className="text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--surface-raised)]"
              >
                View membership plans
              </Button>
            </div>

            <div data-reveal="up" style={{ "--i": 4 } as CSSProperties} className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2" aria-hidden="true">
                {JOIN_AVATARS.map(a => (
                  <span
                    key={a.initials}
                    className={`w-9 h-9 rounded-full border-2 border-[var(--surface-page)] flex items-center justify-center font-mono text-[11px] font-semibold text-white ${a.bg}`}
                  >
                    {a.initials}
                  </span>
                ))}
              </div>
              <p className="text-caption text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">34,000+</span> verified leaders read every issue
              </p>
            </div>
          </div>

          {/* What membership includes: numbered list on a raised inverse panel */}
          <ol data-reveal="right" style={{ "--i": 1 } as CSSProperties} className="rounded-overlay border border-[var(--border-subtle)] bg-[var(--surface-raised)] divide-y divide-[var(--border-subtle)] shadow-overlay">
            {JOIN_BENEFITS.map((item, i) => (
              <li key={item.title} data-reveal="up" style={{ "--i": i + 3 } as CSSProperties} className="flex gap-5 p-6">
                <span className="font-mono text-label font-semibold text-[var(--premium-text)] pt-1 tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-h4 font-semibold text-[var(--text-primary)] mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-muted)]">{item.body}</p>
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
