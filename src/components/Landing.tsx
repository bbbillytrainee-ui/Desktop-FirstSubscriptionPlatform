import { useMemo, useState } from "react"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import TaxonomyNav from "./layout/TaxonomyNav"
import Button from "./ui/Button"
import Badge from "./ui/Badge"
import ArticleCard from "./magazine/ArticleCard"
import ArticleReader from "./magazine/ArticleReader"
import MagazineFlipbook from "./magazine/MagazineFlipbook"
import LastMonthTrending from "./magazine/LastMonthTrending"
import LatestNewsSidebar from "./news/LatestNewsSidebar"
import Card from "./ui/Card"
import SectionHeader from "./ui/SectionHeader"
import TextLink from "./ui/TextLink"
import Avatar from "./ui/Avatar"
import EmptyState from "./ui/EmptyState"
import Reveal from "./ui/Reveal"
import CountUp from "./ui/CountUp"
import { BookOpen } from "./ui/Icons"
import SafeImage from "./ui/SafeImage"
import { ARTICLES, Article } from "../data/fixtures/articles"
import { ISSUES, Issue } from "../data/fixtures/issues"
import { PROFILES } from "../data/fixtures/profiles"
import { WEBINARS } from "../data/fixtures/webinars"
import { RESEARCH_REPORTS } from "../data/fixtures/reports"
import { TOPICS, ALL_TOPIC_ID, filterByTopic, getTopic, readTopicFromUrl, writeTopicToUrl } from "../data/topics"
import { withViewTransition, prefersReducedMotion } from "../lib/motion"

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

export interface LandingProps {
  onGetAccess: () => void
  onNavigate?: (route: string) => void
}

export default function Landing({ onGetAccess, onNavigate }: LandingProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
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

  const selectTopic = (topicId: string, { scroll = true } = {}) => {
    writeTopicToUrl(topicId)
    withViewTransition(() => {
      setSelectedArticle(null)
      setActiveTopic(topicId)
    })
    if (scroll) document.getElementById("articles-section")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
        <Header onJoin={onGetAccess} onSignIn={onGetAccess} onNavigate={onNavigate} />
        <TaxonomyNav activeTopic={activeTopic} counts={topicCounts} onSelectTopic={id => selectTopic(id, { scroll: false })} />
        <main className="flex-1 py-8">
          <ArticleReader
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onJoinPrompt={onGetAccess}
            onOpenFlipbook={() => {
              const matched = ISSUES.find(i => i.id === selectedArticle.issueId) || currentIssue
              setActiveFlipbookIssue(matched)
              setSelectedArticle(null)
              setShowFlipbook(true)
            }}
          />
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    )
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
      <TaxonomyNav activeTopic={activeTopic} counts={topicCounts} onSelectTopic={id => selectTopic(id)} />

      {/* SECTION 1: Editorial Masthead & Hero */}
      <section className="border-b border-[var(--color-border-subtle)] py-14 lg:py-20 px-6 md:px-12 hero-radial-bg relative overflow-hidden">
        
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-10 lg:gap-14 items-center relative z-10">
          {/* Left Column: Vision & Primary Actions */}
          <div>
            <span className="block mb-4 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-brand-coral)]">
              Pharma · MedTech · AI-Health
            </span>

            <h1 
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)" }}
              className="font-serif font-bold text-[var(--color-ink)] leading-[1.08] tracking-tight mb-6"
            >
              A serious publication <span className="font-serif italic font-normal text-[var(--color-brand-coral)] px-0.5">&amp;</span> network for the people building what healthcare becomes next.
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-slate-muted)] leading-relaxed mb-9 max-w-xl">
              Curated monthly intelligence, deep life science dossiers, and explainable peer introductions for verified healthcare leaders across regulatory, clinical, and commercial tracks.
            </p>

            <div className="flex items-center gap-4 flex-wrap mb-10">
              <Button variant="coral" size="lg" onClick={onGetAccess}>
                Join the network
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setShowFlipbook(true)}>
                <BookOpen size={16} />
                <span>Read Issue #{currentIssue.number}</span>
              </Button>
            </div>

            {/* Credibility Credentials Trust Row */}
            <dl className="pt-7 border-t border-[var(--color-border-subtle)] grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: 34000, suffix: "+", label: "Verified Leaders" },
                { value: 48, suffix: "+", label: "Annual Dossiers" },
                { value: 100, suffix: "%", label: "Peer Cited Rigor" },
                { value: currentIssue.number, label: "Issues Published" },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="text-[11px] font-semibold text-[var(--color-slate-muted)] uppercase tracking-wider leading-tight mt-1.5">
                    {stat.label}
                  </dt>
                  <dd className="font-mono text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] leading-none">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right Column: Current Issue Spotlight Card */}
          <Card padding="lg" interactive className="group">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--color-border-subtle)]">
              <span className="font-mono text-meta font-semibold uppercase tracking-wider text-[var(--color-slate-muted)]">
                Issue #{currentIssue.number} · {currentIssue.month}
              </span>
              <Badge type="pro" label="Current Issue" />
            </div>

            <button
              type="button"
              aria-label={`Read Issue #${currentIssue.number}: ${currentIssue.theme}`}
              className="block w-full h-56 rounded-control overflow-hidden mb-4 cursor-pointer"
              onClick={() => setShowFlipbook(true)}
            >
              <SafeImage
                src={currentIssue.coverImage}
                alt={currentIssue.theme}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </button>

            <h3 className="font-serif text-h3 font-semibold text-[var(--color-ink)] mb-2">
              {currentIssue.theme}
            </h3>
            <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed mb-4 line-clamp-2">
              {currentIssue.summary}
            </p>

            <div className="flex items-center justify-end pt-4 border-t border-[var(--color-border-subtle)]">
              <TextLink tone="muted" onClick={() => onNavigate?.("archive")}>
                Past editions
              </TextLink>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 3: Newspaper Editorial Grid (Lead Dossier + Live Breaking Sidebar + 3 Sub-Features) */}

      <section id="articles-section" className="py-14 px-6 md:px-12 border-b border-[var(--color-border-subtle)] bg-card">
        <div className="max-w-[var(--container-max)] mx-auto">
          
          <SectionHeader
            eyebrow="Editorial Exclusives"
            title="Latest Life Science Dossiers"
            action={
              activeTopic !== ALL_TOPIC_ID && (
                <TextLink tone="muted" arrow={false} onClick={() => selectTopic(ALL_TOPIC_ID, { scroll: false })}>
                  Show all topics
                </TextLink>
              )
            }
          />

          {/* Top Row: Hero Article (7 cols) + Live Breaking Feed Sidebar (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-8">
              {filteredArticles.length > 0 ? (
                <ArticleCard
                  article={filteredArticles[0]}
                  variant="hero"
                  onClick={() => setSelectedArticle(filteredArticles[0])}
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

            <div className="lg:col-span-4">
              <LatestNewsSidebar onSubscribe={onGetAccess} />
            </div>
          </div>

          {/* Bottom Row: 3 Secondary Feature Cards in a clean 3-column row */}
          {filteredArticles.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[var(--color-border-subtle)] mb-12">
              {filteredArticles.slice(1, 4).map((article, i) => (
                <Reveal key={article.slug} delay={i * 70} className="h-full">
                  <ArticleCard article={article} variant="standard" onClick={() => setSelectedArticle(article)} />
                </Reveal>
              ))}
            </div>
          )}

          {/* Dedicated Last Month's Trending Retrospective */}
          {lastMonthIssue && (
            <Reveal>
            <LastMonthTrending
              lastMonthIssue={lastMonthIssue}
              lastMonthArticles={lastMonthArticles}
              onSelectArticle={art => setSelectedArticle(art)}
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
      <section className="py-16 px-6 md:px-12 bg-[var(--color-section-dark)] text-white border-b border-white/10 relative overflow-hidden">
        <div className="max-w-[var(--container-max)] mx-auto relative z-10">
          <Reveal>
          <SectionHeader
            eyebrow="Core Coverage"
            title="Three verticals. Focused depth."
            description="Uncompromising monthly analysis written for decision-makers in medicine, biotechnology, and health technology."
            align="center"
            tone="dark"
            className="mb-12"
          />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERTICALS.map((v, i) => (
              <Reveal key={v.topicId} delay={i * 70} className="h-full">
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
                  <p className="text-sm text-stone-300 leading-relaxed mb-6">{v.description}</p>
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

      {/* SECTION 5: Webinar Spotlight + Verified Network Teaser */}
      <section className="py-14 px-6 md:px-12 border-b border-[var(--color-border-subtle)] bg-card">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Col (5 cols): Upcoming Webinar */}
            <Reveal className="lg:col-span-5">
            <Card variant="muted" padding="lg" className="flex flex-col justify-between">
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
            <Reveal delay={80} className="lg:col-span-7">
              <SectionHeader
                as="h3"
                eyebrow="Verified Network"
                title="Connect with leaders across the ecosystem"
                action={<TextLink onClick={onGetAccess} className="hidden sm:inline-flex">Explore the member directory</TextLink>}
                className="mb-5"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROFILES.slice(0, 2).map(p => (
                  <Card key={p.id} variant="muted" className="flex flex-col justify-between">
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

              <div className="mt-4 px-4 py-3 bg-[var(--color-paper)] border border-[var(--color-border-subtle)] rounded-card flex items-center justify-between gap-4 text-meta">
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
      <section className="py-14 px-6 md:px-12 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <SectionHeader
            eyebrow="Institutional Intelligence"
            title="Deep Industry Briefings & Dossiers"
            action={<TextLink onClick={() => onNavigate?.("reports")}>Browse all reports</TextLink>}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESEARCH_REPORTS.map((rep, i) => (
              <Reveal key={rep.id} delay={i * 70} className="h-full">
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

      {/* SECTION 7: Final High-Impact Subscription Callout with Animated Mesh Background */}
      <section className="py-20 px-6 md:px-12 cta-mesh-bg text-white text-center relative z-10 border-t border-white/10">
        <div className="max-w-3xl mx-auto relative z-20">
          <div className="flex items-center justify-center -space-x-2 mb-6">
            <div className="w-9 h-9 rounded-full border-2 border-white bg-[var(--color-brand-teal)] flex items-center justify-center font-bold text-xs shadow-md">
              DR
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white bg-[var(--color-brand-coral-fill)] flex items-center justify-center font-bold text-xs shadow-md">
              AP
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white bg-emerald-700 flex items-center justify-center font-bold text-xs shadow-md">
              SK
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white bg-cyan-700 flex items-center justify-center font-bold text-xs shadow-md">
              VS
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-[11px] font-mono font-bold shadow-md">
              +34k
            </div>
          </div>

          <span
            className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-brand-coral-on-dark)] block mb-3.5"
          >
            Join Mediverse Life Sciences
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight text-white"
          >
            The publication &amp; network for healthcare decision-makers.
          </h2>
          <p className="text-sm md:text-base text-stone-200/90 mb-9 leading-relaxed max-w-2xl mx-auto">
            Read curated monthly dossiers, interact with digital 3D flipbook magazines, and receive explainable peer introductions across Pharma, MedTech, and AI-Health.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button variant="coral" size="lg" onClick={onGetAccess}>
              Join the network
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onNavigate && onNavigate("subscriptions")} className="text-white border border-white/20 hover:bg-white/10">
              View Membership Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
