import { useState } from "react"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import TaxonomyNav from "./layout/TaxonomyNav"
import Button from "./ui/Button"
import Badge from "./ui/Badge"
import ArticleCard from "./magazine/ArticleCard"
import ArticleReader from "./magazine/ArticleReader"
import MagazineFlipbook from "./magazine/MagazineFlipbook"
import LatestNewsSidebar from "./news/LatestNewsSidebar"
import { ARTICLES, Article } from "../data/fixtures/articles"
import { ISSUES } from "../data/fixtures/issues"
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
  const [activeTaxonomy, setActiveTaxonomy] = useState("All Intelligence")

  const currentIssue = ISSUES[0]
  const heroArticle = ARTICLES[0]
  const secondaryArticles = ARTICLES.slice(1, 4)
  const nextWebinar = WEBINARS[0]

  const filteredArticles = activeTaxonomy === "All Intelligence"
    ? ARTICLES
    : ARTICLES.filter(a =>
        a.category.toLowerCase().includes(activeTaxonomy.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(activeTaxonomy.toLowerCase()))
      )

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
            onOpenFlipbook={() => { setSelectedArticle(null); setShowFlipbook(true); }}
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
          issue={currentIssue}
          articles={ARTICLES}
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
      <section className="border-b border-[var(--color-border-subtle)] py-12 lg:py-16 px-6 md:px-12 bg-[var(--color-paper)]">

        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-10 lg:gap-14 items-center">
          {/* Left Column: Vision & Primary Actions */}
          <div>
            <div className="mb-3.5">
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-xs font-semibold tracking-[0.18em] uppercase text-[var(--color-brand-coral)]"
              >
                Pharma · MedTech · AI-Health
              </span>
            </div>

            <h1
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl lg:text-[50px] font-semibold text-[var(--color-ink)] leading-[1.08] tracking-tight mb-5"
            >
              A serious publication <span className="font-serif italic font-normal text-[var(--color-brand-coral)] px-0.5 text-[0.95em]">&amp;</span> network for the people building what healthcare becomes next.
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-slate-muted)] leading-relaxed mb-8 max-w-xl">
              Curated monthly intelligence, deep life science dossiers, and explainable peer introductions for verified healthcare leaders across regulatory, clinical, and commercial tracks.
            </p>

            <div className="flex items-center gap-3.5 flex-wrap">
              <Button variant="coral" size="lg" onClick={onGetAccess}>
                Join the network
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowFlipbook(true)}
              >
                <svg className="w-4 h-4 text-current shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Open 3D Reader</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  const element = document.createElement("a")
                  const file = new Blob([
                    `MEDIVERSE LIFE SCIENCES — ISSUE #${currentIssue.number}\n\nTheme: ${currentIssue.theme}\nDate: ${currentIssue.month}\n\nSummary:\n${currentIssue.summary}\n\nFull edition available at: https://mediverse.network`
                  ], { type: "text/plain" })
                  element.href = URL.createObjectURL(file)
                  element.download = `Mediverse_Issue_${currentIssue.number}_Digital_Edition.txt`

                  document.body.appendChild(element)
                  element.click()
                  document.body.removeChild(element)
                }}
              >
                <svg className="w-4 h-4 text-[var(--color-brand-teal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Briefing</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Current Issue Spotlight Card */}
          <div className="bg-white border border-[var(--color-border-subtle)] rounded-sm p-6 shadow-xs relative group hover:border-[var(--color-brand-teal)] transition-colors">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3 mb-4">
              <span
                style={{ fontFamily: "'Geist Mono', monospace" }}
                className="text-xs font-semibold text-[var(--color-slate-muted)] uppercase tracking-wider"
              >
                Issue #{currentIssue.number} · {currentIssue.month}
              </span>
              <Badge type="pro" label="Current Issue" />
            </div>

            <div
              className="h-52 rounded-sm overflow-hidden mb-4 relative cursor-pointer group/img"
              onClick={() => setShowFlipbook(true)}
            >
              <img
                src={currentIssue.coverImage}
                alt={currentIssue.theme}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-xs font-bold text-white bg-[var(--color-brand-teal)] px-3 py-1.5 rounded-xs shadow-md flex items-center gap-1.5"
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

            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)] text-xs font-mono">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[var(--color-border-subtle)]">
            {(filteredArticles.length > 1 ? filteredArticles.slice(1, 4) : secondaryArticles).map(article => (
              <ArticleCard
                key={article.slug}
                article={article}
                variant="standard"
                onClick={() => setSelectedArticle(article)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: Three-Lane Focus Areas (Pharma, MedTech, AI) */}
      <section className="py-14 px-6 md:px-12 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-xs font-semibold tracking-[0.16em] uppercase text-[var(--color-brand-coral)] block mb-2"
            >
              Core Coverage
            </span>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl font-semibold text-[var(--color-ink)] mb-2"
            >
              Three verticals. Focused depth.
            </h2>
            <p className="text-sm text-[var(--color-slate-muted)]">
              Uncompromising monthly analysis written for decision-makers in medicine, biotechnology, and health technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => { setActiveTaxonomy("Pharma"); const el = document.getElementById("articles-section"); if (el) el.scrollIntoView({ behavior: "smooth" }) }}
              className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm hover:border-[var(--color-brand-teal)] cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div>
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-coral)] block mb-2"
                >
                  01 / Pharma & Biologics
                </span>
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-lg font-semibold text-[var(--color-ink)] mb-2"
                >
                  Drug Discovery & Regulatory Submissions
                </h3>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                  CDSCO clinical guidance, oncology HEOR evidence, biosimilars scale-up, and regional drug pricing dynamics.
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--color-brand-teal)] font-mono">
                Explore Pharma Coverage →
              </span>
            </div>

            <div
              onClick={() => { setActiveTaxonomy("MedTech"); const el = document.getElementById("articles-section"); if (el) el.scrollIntoView({ behavior: "smooth" }) }}
              className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm hover:border-[var(--color-brand-teal)] cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div>
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-teal)] block mb-2"
                >
                  02 / MedTech & Diagnostics
                </span>
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-lg font-semibold text-[var(--color-ink)] mb-2"
                >
                  Device Engineering & Cross-Border IP
                </h3>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                  Surgical robotics licensing, point-of-care diagnostics, precision hardware, and supply chain integrity.
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--color-brand-teal)] font-mono">
                Explore MedTech Coverage →
              </span>
            </div>

            <div
              onClick={() => { setActiveTaxonomy("AI-Health"); const el = document.getElementById("articles-section"); if (el) el.scrollIntoView({ behavior: "smooth" }) }}
              className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm hover:border-[var(--color-brand-teal)] cursor-pointer transition-colors flex flex-col justify-between"
            >
              <div>
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-coral)] block mb-2"
                >
                  03 / AI & Digital Health
                </span>
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-lg font-semibold text-[var(--color-ink)] mb-2"
                >
                  SaMD Validation & Automated Safety
                </h3>
                <p className="text-xs text-[var(--color-slate-muted)] leading-relaxed mb-4">
                  Clinical AI trial design, NLP pharmacovigilance pipelines, synthetic controls, and health data governance.
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--color-brand-teal)] font-mono">
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

      {/* SECTION 7: Final High-Impact Subscription Callout */}
      <section className="py-16 px-6 md:px-12 bg-[var(--color-brand-teal)] text-[var(--color-paper)] text-center">
        <div className="max-w-2xl mx-auto">
          <span
            style={{ fontFamily: "'Geist Mono', monospace" }}
            className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-brand-coral)] block mb-3"
          >
            Join Mediverse Life Sciences

          </span>
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-3xl sm:text-4xl font-semibold mb-4 leading-tight"
          >
            The publication and network for healthcare decision-makers.
          </h2>
          <p className="text-sm md:text-base text-white/80 mb-8 leading-relaxed">
            Read curated monthly dossiers, interact with digital 3D flipbook magazines, and receive explainable peer introductions across Pharma, MedTech, and AI-Health.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button variant="coral" size="lg" onClick={onGetAccess}>
              Join the network now →
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onNavigate && onNavigate("subscriptions")}>
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
