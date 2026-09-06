import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { PODCAST_EPISODES, PodcastEpisode } from "../data/fixtures/podcasts"

export interface PodcastsPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function PodcastsPage({ onJoin, onNavigate }: PodcastsPageProps) {
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(PODCAST_EPISODES[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(25)

  const togglePlay = () => {
    setIsPlaying(p => !p)
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full pb-32">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Audio Intelligence Series
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Mediverse Dialogues

          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            Unfiltered 35-minute audio conversations with CEOs, VP regulatory strategists, and supply chain architects shaping life sciences in India and APAC.
          </p>
        </div>

        {/* Featured Episode Hero Card */}
        <div className="bg-white border-2 border-[var(--color-brand-teal)] rounded-sm p-8 shadow-md mb-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <Badge type="pro" label={`Episode #${activeEpisode.episodeNumber}`} />
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-[var(--color-slate-muted)]">
                  {activeEpisode.date} · {activeEpisode.duration}
                </span>
              </div>

              <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] leading-snug">
                {activeEpisode.title}
              </h2>

              <p className="text-sm text-[var(--color-slate-muted)] leading-relaxed">
                {activeEpisode.summary}
              </p>

              <div className="flex items-center gap-2 flex-wrap pt-2">
                {activeEpisode.topics.map(t => (
                  <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] px-2.5 py-0.5 bg-[var(--color-surface)] text-[var(--color-brand-teal)] font-semibold rounded-sm border border-[var(--color-border-subtle)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Guest Profile Card & Big Play Trigger */}
            <div className="lg:col-span-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-brand-teal)] text-white flex items-center justify-center font-bold text-lg mb-3 shadow-md">
                {activeEpisode.guest.split(" ").map(n => n[0]).join("")}
              </div>
              <h4 className="text-sm font-semibold text-[var(--color-ink)]">{activeEpisode.guest}</h4>
              <p className="text-xs text-[var(--color-slate-muted)] mb-4">{activeEpisode.guestRole}, {activeEpisode.guestCompany}</p>
              
              <Button variant="coral" size="md" className="w-full" onClick={togglePlay}>
                {isPlaying ? "❚❚ Pause Episode" : "▶ Play Episode (" + activeEpisode.duration + ")"}
              </Button>
            </div>
          </div>
        </div>

        {/* Episode Archive List */}
        <div className="space-y-4 mb-16">
          <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-semibold text-[var(--color-ink)] mb-4">
            Recent Episodes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PODCAST_EPISODES.map(ep => (
              <div
                key={ep.id}
                onClick={() => { setActiveEpisode(ep); setIsPlaying(true) }}
                className={`p-5 bg-white border rounded-sm flex flex-col justify-between hover:border-[var(--color-brand-teal)]/60 transition-all shadow-sm cursor-pointer ${
                  activeEpisode.id === ep.id ? "border-[var(--color-brand-teal)] ring-1 ring-[var(--color-brand-teal)]" : "border-[var(--color-border-subtle)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] uppercase font-bold text-[var(--color-brand-coral)]">
                      Episode 0{ep.episodeNumber}
                    </span>
                    <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-[var(--color-slate-muted)]">
                      {ep.duration}
                    </span>
                  </div>
                  <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-base font-semibold text-[var(--color-ink)] leading-snug mb-2">
                    {ep.title}
                  </h4>
                  <p className="text-xs text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-4">
                    {ep.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--color-ink)]">{ep.guest}</span>
                  <span className="text-[var(--color-brand-teal)] font-semibold">Listen ▶</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe on Platform Bar */}
        <div className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-1">
              Listen to Meridian Dialogues Anywhere
            </h4>
            <p className="text-xs text-[var(--color-slate-muted)]">
              Available on Apple Podcasts, Spotify, Amazon Music, and RSS.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs font-medium rounded-sm">
              🟢 Spotify
            </span>
            <span className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-xs font-medium rounded-sm">
              🟣 Apple Podcasts
            </span>
          </div>
        </div>
      </main>

      {/* Persistent Bottom Audio Player Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0A2630] text-white border-t border-[var(--color-brand-teal)]/40 px-6 py-3 shadow-2xl">
        <div className="max-w-[var(--container-max)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[var(--color-brand-coral)] hover:bg-[#b84e2e] text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-md"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <div>
              <span className="text-xs font-semibold text-white block truncate max-w-sm">
                EP {activeEpisode.episodeNumber}: {activeEpisode.title}
              </span>
              <span className="text-[10px] text-white/70">
                Guest: {activeEpisode.guest} ({activeEpisode.guestCompany})
              </span>
            </div>
          </div>

          {/* Interactive Progress Slider */}
          <div className="w-full sm:w-80 flex items-center gap-2">
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-white/60">
              08:42
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg accent-[var(--color-brand-coral)] cursor-pointer"
            />
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-white/60">
              {activeEpisode.duration}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs" onClick={onJoin}>
              Read Episode Transcript
            </Button>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
