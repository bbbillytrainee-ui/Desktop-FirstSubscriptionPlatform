import { useState } from "react"
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
import { BookOpen, Download, Sparkles } from "./ui/Icons"
import { useToast } from "../lib/toast"
import SafeImage from "./ui/SafeImage"
import { ARTICLES, Article } from "../data/fixtures/articles"
import { ISSUES, Issue } from "../data/fixtures/issues"
import { PROFILES } from "../data/fixtures/profiles"
import { WEBINARS } from "../data/fixtures/webinars"
import { RESEARCH_REPORTS } from "../data/fixtures/reports"

export interface LandingProps {
  onGetAccess: () => void
  onNavigate?: (route: string) => void
}

export default function Landing({ onGetAccess, onNavigate }: LandingProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [activeFlipbookIssue, setActiveFlipbookIssue] = useState<Issue>(ISSUES[0])
  const [activeTaxonomy, setActiveTaxonomy] = useState("All Intelligence")

  const currentIssue = ISSUES[0]
  const lastMonthIssue = ISSUES[1]
  const lastMonthArticles = ARTICLES.filter(a => a.issueId === lastMonthIssue.id)
  const heroArticle = ARTICLES[0]
  const secondaryArticles = ARTICLES.slice(1, 4)
  const nextWebinar = WEBINARS[0]

  const filteredArticles = activeTaxonomy === "All Intelligence"
    ? ARTICLES
    : ARTICLES.filter(a =>
        a.category.toLowerCase().includes(activeTaxonomy.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(activeTaxonomy.toLowerCase()))
      )

  const { success } = useToast()

  const handleDownloadBriefing = () => {
    const element = document.createElement("a")
    const file = new Blob([
      `MEDIVERSE LIFE SCIENCES — ISSUE #${currentIssue.number}\n\nTheme: ${currentIssue.theme}\nDate: ${currentIssue.month}\n\nSummary:\n${currentIssue.summary}\n\nFull edition available at: https://mediverse.network\n`
    ], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Mediverse_Issue_${currentIssue.number}_Digital_Briefing.txt`

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    success("Executive Briefing Downloaded", `Issue #${currentIssue.number} briefing downloaded.`)
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
        <Header onJoin={onGetAccess} onSignIn={onGetAccess} onNavigate={onNavigate} />
        <TaxonomyNav activeTaxonomy={activeTaxonomy} onSelectTaxonomy={setActiveTaxonomy} />
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
      <TaxonomyNav
        activeTaxonomy={activeTaxonomy}
        onSelectTaxonomy={t => {
          setActiveTaxonomy(t)
          const el = document.getElementById("articles-section")
          if (el) el.scrollIntoView({ behavior: "smooth" })
        }}
      />

      {/* SECTION 1: Editorial Masthead & Hero */}
      <section className="border-b border-[var(--color-border-subtle)] py-14 lg:py-20 px-6 md:px-12 hero-radial-bg relative overflow-hidden">
        
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-10 lg:gap-14 items-center relative z-10">
          {/* Left Column: Vision & Primary Actions */}
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-brand-coral)]">
                Pharma · MedTech · AI-Health
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-[10px] font-mono font-semibold text-emerald-800 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>340+ Leaders Reading Issue #15 Live</span>
              </div>
            </div>

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
              <Button variant="coral" size="lg" onClick={onGetAccess} className="shadow-[0_4px_16px_rgba(208,96,61,0.28)] hover:shadow-[0_6px_22px_rgba(208,96,61,0.36)] transition-shadow">
                Join the network
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowFlipbook(true)}
                className="shadow-2xs"
              >
                <BookOpen size={16} />
                <span>Open 3D Reader</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleDownloadBriefing}
              >
                <Download size={16} className="text-[var(--color-brand-teal)]" />
                <span>Download Briefing</span>
              </Button>
            </div>

            {/* Credibility Credentials Trust Row */}
            <div className="pt-7 border-t border-[var(--color-border-subtle)] grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[var(--color-ink)] leading-none">34,000+</div>
                <div className="text-[11px] font-semibold text-[var(--color-slate-muted)] uppercase tracking-wider leading-tight mt-1.5">Verified Leaders</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[var(--color-ink)] leading-none">48+</div>
                <div className="text-[11px] font-semibold text-[var(--color-slate-muted)] uppercase tracking-wider leading-tight mt-1.5">Annual Dossiers</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[var(--color-ink)] leading-none">100%</div>
                <div className="text-[11px] font-semibold text-[var(--color-slate-muted)] uppercase tracking-wider leading-tight mt-1.5">Peer Cited Rigor</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[var(--color-brand-teal)] leading-none">Zero Ads</div>
                <div className="text-[11px] font-semibold text-[var(--color-slate-muted)] uppercase tracking-wider leading-tight mt-1.5">Member Supported</div>
              </div>
            </div>
          </div>

          {/* Right Column: Current Issue Spotlight Card */}
          <div className="card-tactile p-6 relative group border border-[var(--color-border-subtle)] bg-white">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3.5 mb-4">
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-xs font-semibold text-[var(--color-slate-muted)] uppercase tracking-wider"
              >
                Issue #{currentIssue.number} · {currentIssue.month}
              </span>
              <Badge type="pro" label="Current Issue" />
            </div>

            <div
              className="h-56 rounded-lg overflow-hidden mb-4 relative cursor-pointer group/img shadow-2xs"
              onClick={() => setShowFlipbook(true)}
            >
              <SafeImage
                src={currentIssue.coverImage}
                alt={currentIssue.theme}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-xs font-bold text-white bg-[var(--color-brand-teal)] px-3 py-1.5 rounded-sm shadow-md flex items-center gap-1.5"
                >
                  <span>Launch Interactive Reader</span>
                  <span>→</span>
                </span>
              </div>
            </div>

            <h3
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-xl font-semibold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-brand-teal)] transition-colors"
            >
              {currentIssue.theme}
            </h3>
            <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4 line-clamp-2">
              {currentIssue.summary}
            </p>

            <div className="flex items-center justify-between pt-3.5 border-t border-[var(--color-border-subtle)] text-xs font-mono">
              <button
                onClick={() => setShowFlipbook(true)}
                className="font-bold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-coral)] transition-colors flex items-center gap-1"
              >
                <span>Read 3D Flipbook</span>
                <span>→</span>
              </button>
              <button
                onClick={() => onNavigate && onNavigate("archive")}
                className="text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] hover:underline"
              >
                Past Editions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Newspaper Editorial Grid (Lead Dossier + Live Breaking Sidebar + 3 Sub-Features) */}

      <section id="articles-section" className="py-14 px-6 md:px-12 border-b border-[var(--color-border-subtle)] bg-white">
        <div className="max-w-[var(--container-max)] mx-auto">
          
          <div className="flex items-end justify-between border-b border-[var(--color-border-subtle)] pb-4 mb-8">
            <div>
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-brand-coral)] block mb-1"
              >
                Editorial Exclusives
              </span>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl font-semibold text-[var(--color-ink)]"
              >
                Latest Life Science Dossiers
              </h2>
            </div>
            {activeTaxonomy !== "All Intelligence" && (
              <button
                onClick={() => setActiveTaxonomy("All Intelligence")}
                className="text-xs text-[var(--color-brand-coral)] underline font-mono"
              >
                Reset to All Topics
              </button>
            )}
          </div>

          {/* Top Row: Hero Article (7 cols) + Live Breaking Feed Sidebar (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            <div className="lg:col-span-8">
              <ArticleCard
                article={filteredArticles[0] || heroArticle}
                variant="hero"
                onClick={() => setSelectedArticle(filteredArticles[0] || heroArticle)}
              />
            </div>

            <div className="lg:col-span-4">
              <LatestNewsSidebar onSubscribe={onGetAccess} />
            </div>
          </div>

          {/* Bottom Row: 3 Secondary Feature Cards in a clean 3-column row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[var(--color-border-subtle)] mb-12">
            {(filteredArticles.length > 1 ? filteredArticles.slice(1, 4) : secondaryArticles).map(article => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="standard"
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>

          {/* Dedicated Last Month's Trending Retrospective */}
          {lastMonthIssue && (
            <LastMonthTrending
              lastMonthIssue={lastMonthIssue}
              lastMonthArticles={lastMonthArticles}
              onSelectArticle={art => setSelectedArticle(art)}
              onOpenIssueFlipbook={issue => {
                setActiveFlipbookIssue(issue)
                setShowFlipbook(true)
              }}
            />
          )}

        </div>
      </section>

      {/* SECTION 4: Three-Lane Focus Areas (Pharma, MedTech, AI) - Dark Mode Island */}
      <section className="py-16 px-6 md:px-12 bg-[#0A1F28] text-white border-b border-white/10 relative overflow-hidden">
        <div className="max-w-[var(--container-max)] mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-brand-coral)] block mb-2"
            >
              Core Coverage
            </span>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-semibold text-white mb-3"
            >
              Three verticals. Focused depth.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Uncompromising monthly analysis written for decision-makers in medicine, biotechnology, and health technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => { setActiveTaxonomy("Pharma"); const el = document.getElementById("articles-section"); if (el) el.scrollIntoView({ behavior: "smooth" }) }}
              className="p-7 bg-[#071921] border border-white/12 rounded-xl hover:border-[var(--color-brand-coral)] cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)] block mb-3"
                >
                  01 / Pharma & Biologics
                </span>
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-xl font-semibold text-white mb-3 group-hover:text-[var(--color-brand-coral)] transition-colors"
                >
                  Drug Discovery & Regulatory Submissions
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-6">
                  CDSCO clinical guidance, oncology HEOR evidence, biosimilars scale-up, and regional drug pricing dynamics.
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--color-brand-coral)] font-mono group-hover:translate-x-1 transition-transform inline-block">
                Explore Pharma Coverage →
              </span>
            </div>

            <div
              onClick={() => { setActiveTaxonomy("MedTech"); const el = document.getElementById("articles-section"); if (el) el.scrollIntoView({ behavior: "smooth" }) }}
              className="p-7 bg-[#071921] border border-white/12 rounded-xl hover:border-cyan-400 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-3"
                >
                  02 / MedTech & Diagnostics
                </span>
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors"
                >
                  Device Engineering & Cross-Border IP
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-6">
                  Surgical robotics licensing, point-of-care diagnostics, precision hardware, and supply chain integrity.
                </p>
              </div>
              <span className="text-xs font-semibold text-cyan-400 font-mono group-hover:translate-x-1 transition-transform inline-block">
                Explore MedTech Coverage →
              </span>
            </div>

            <div
              onClick={() => { setActiveTaxonomy("AI-Health"); const el = document.getElementById("articles-section"); if (el) el.scrollIntoView({ behavior: "smooth" }) }}
              className="p-7 bg-[#071921] border border-white/12 rounded-xl hover:border-emerald-400 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
            >
              <div>
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-3"
                >
                  03 / AI & Digital Health
                </span>
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-300 transition-colors"
                >
                  SaMD Validation & Automated Safety
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-6">
                  Clinical AI trial design, NLP pharmacovigilance pipelines, synthetic controls, and health data governance.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 font-mono group-hover:translate-x-1 transition-transform inline-block">
                Explore AI-Health Coverage →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Webinar Spotlight + Verified Network Teaser */}
      <section className="py-14 px-6 md:px-12 border-b border-[var(--color-border-subtle)] bg-white">
        <div className="max-w-[var(--container-max)] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col (5 cols): Live Upcoming Webinar Card */}
            <div className="lg:col-span-5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border-subtle)]">
                  <span
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)]"
                  >
                    Upcoming Masterclass
                  </span>
                  <span className="text-xs font-mono text-[var(--color-slate-muted)]">
                    {nextWebinar.date}
                  </span>
                </div>

                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-xl font-semibold text-[var(--color-ink)] mb-2.5"
                >
                  {nextWebinar.title}
                </h3>

                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-5">
                  {nextWebinar.description}
                </p>

                <div className="p-3 bg-white border border-[var(--color-border-subtle)] rounded-xs mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand-teal)] text-white flex items-center justify-center font-bold text-xs">
                    {nextWebinar.speaker.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--color-ink)]">{nextWebinar.speaker}</div>
                    <div className="text-[11px] text-[var(--color-slate-muted)]">{nextWebinar.speakerRole}, {nextWebinar.speakerCompany}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)]">
                <Button variant="coral" size="sm" onClick={() => onNavigate ? onNavigate("webinars") : onGetAccess()}>
                  Reserve Seat (Free for Members)
                </Button>
                <button
                  onClick={() => onNavigate && onNavigate("webinars")}
                  className="text-xs text-[var(--color-slate-muted)] hover:text-[var(--color-ink)] font-mono underline"
                >
                  All Webinars →
                </button>
              </div>
            </div>

            {/* Right Col (7 cols): Verified Network Introductions */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-brand-teal)] block mb-1"
                  >
                    Verified Network
                  </span>
                  <h3
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    className="text-2xl font-semibold text-[var(--color-ink)]"
                  >
                    Connect with leaders across the ecosystem
                  </h3>
                </div>
                <button
                  onClick={onGetAccess}
                  className="text-xs font-semibold text-[var(--color-brand-coral)] font-mono hover:underline hidden sm:block"
                >
                  Explore 2,400+ Members →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROFILES.slice(0, 2).map(p => (
                  <div key={p.id} className="p-5 border border-[var(--color-border-subtle)] rounded-sm bg-[var(--color-surface)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-brand-teal)] text-white flex items-center justify-center font-bold text-xs">
                          {p.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-[var(--color-ink)]">{p.name}</h4>
                          <p className="text-[11px] text-[var(--color-slate-muted)]">{p.title} · {p.org}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-3">{p.bio}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[var(--color-border-subtle)]">
                      {p.tags.slice(0, 2).map(t => (
                        <span
                          key={t}
                          style={{ fontFamily: "'Geist Mono', monospace" }}
                          className="text-[9px] px-2 py-0.5 bg-white text-[var(--color-ink)] rounded-xs border border-[var(--color-border-subtle)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-[var(--color-paper)] border border-[var(--color-border-subtle)] rounded-xs flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--color-slate-muted)]">
                  🔒 DPDP Act 2023 Compliant · Explicit Consent Matching Only
                </span>
                <button onClick={onGetAccess} className="text-[var(--color-brand-teal)] font-bold hover:underline">
                  Join Directory →
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 6: Institutional Dossiers / Research Reports */}
      <section className="py-14 px-6 md:px-12 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-[var(--color-border-subtle)]">
            <div>
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-brand-coral)] block mb-1"
              >
                Institutional Intelligence
              </span>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl font-semibold text-[var(--color-ink)]"
              >
                Deep Industry Briefings & Dossiers
              </h2>
            </div>
            <button
              onClick={() => onNavigate && onNavigate("reports")}
              className="text-xs font-semibold text-[var(--color-brand-coral)] font-mono hover:underline"
            >
              Browse All Reports →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESEARCH_REPORTS.map(rep => (
              <div key={rep.id} className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-slate-muted)] mb-2">
                    <span className="uppercase text-[var(--color-brand-teal)] font-bold">{rep.category}</span>
                    <span>{rep.pagesCount} pages</span>
                  </div>
                  <h3
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    className="text-base font-semibold text-[var(--color-ink)] mb-2 leading-snug"
                  >
                    {rep.title}
                  </h3>
                  <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4 line-clamp-3">
                    {rep.executiveSummary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-ink)] font-mono">{rep.price} <span className="text-[10px] font-normal text-stone-500">(Free with Pro)</span></span>
                  <button
                    onClick={() => onNavigate ? onNavigate("reports") : onGetAccess()}
                    className="text-xs font-semibold text-[var(--color-brand-coral)] font-mono hover:underline"
                  >
                    View Dossier →
                  </button>
                </div>
              </div>
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
            <div className="w-9 h-9 rounded-full border-2 border-white bg-[var(--color-brand-coral)] flex items-center justify-center font-bold text-xs shadow-md">
              AP
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white bg-emerald-700 flex items-center justify-center font-bold text-xs shadow-md">
              SK
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white bg-cyan-700 flex items-center justify-center font-bold text-xs shadow-md">
              VS
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold shadow-md">
              +34k
            </div>
          </div>

          <span
            style={{ fontFamily: "'Geist Mono', monospace" }}
            className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-brand-coral)] block mb-3.5"
          >
            Join Mediverse Life Sciences
          </span>
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight text-white"
          >
            The publication &amp; network for healthcare decision-makers.
          </h2>
          <p className="text-sm md:text-base text-stone-200/90 mb-9 leading-relaxed max-w-2xl mx-auto">
            Read curated monthly dossiers, interact with digital 3D flipbook magazines, and receive explainable peer introductions across Pharma, MedTech, and AI-Health.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button 
              variant="coral" 
              size="lg" 
              onClick={onGetAccess}
              className="shadow-[0_8px_25px_rgba(208,96,61,0.4)] hover:shadow-[0_12px_32px_rgba(208,96,61,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              Join the network now →
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onNavigate && onNavigate("subscriptions")} className="text-white border border-white/20 hover:bg-white/10">
              View Membership Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Floating Quick-Launch 3D Book Reader Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFlipbook(true)}
          className="px-4 py-3 bg-gradient-to-r from-[var(--color-brand-teal)] to-[#164e60] text-white text-xs font-semibold rounded-full shadow-[0_10px_30px_rgba(13,59,74,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20 group cursor-pointer"
          style={{ fontFamily: "'Geist Mono', monospace" }}
          title="Open interactive 3D page-turning magazine reader"
        >
          <span className="text-base group-hover:rotate-12 transition-transform">📖</span>
          <span>Launch 3D Book Reader</span>
        </button>
      </div>
    </div>
  )
}
