import { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import { VIDEO_ARCHIVE, VideoItem } from "../data/fixtures/videos"

export interface VideosPageProps {
  onJoin?: () => void
  onNavigate?: (route: string) => void
}

export default function VideosPage({ onJoin, onNavigate }: VideosPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeVideo, setActiveVideo] = useState<VideoItem>(VIDEO_ARCHIVE[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const filteredVideos = selectedCategory === "All"
    ? VIDEO_ARCHIVE
    : VIDEO_ARCHIVE.filter(v => v.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />

      <main className="flex-1 max-w-[var(--container-max)] mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <div className="border-b border-[var(--color-border-subtle)] pb-8 mb-10 max-w-3xl">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold tracking-[0.14em] uppercase text-[var(--color-brand-coral)] block mb-2">
            Visual Briefings & Conclaves
          </span>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--color-ink)] mb-4 leading-tight">
            Video Intelligence Library
          </h1>
          <p className="text-base md:text-lg text-[var(--color-slate-muted)] leading-relaxed">
            High-density executive keynote addresses, panel debate recordings, and tactical 5-minute Knowledge Capsules authored by senior life science practitioners.
          </p>
        </div>

        {/* Featured Video Player View */}
        <div className="bg-black rounded-sm overflow-hidden shadow-2xl mb-12 border border-stone-800">
          <div className="relative aspect-video max-h-[500px] w-full bg-stone-900 flex items-center justify-center group">
            <img
              src={activeVideo.thumbnail}
              alt={activeVideo.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* Play Button Overlay */}
            <button
              onClick={() => setIsPlaying(v => !v)}
              className="relative z-10 w-20 h-20 rounded-full bg-[var(--color-brand-coral)] hover:bg-[#b84e2e] text-white flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(208,96,61,0.6)] cursor-pointer transition-all hover:scale-110"
              aria-label="Play Video"
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            {/* Video Meta Overlay at Bottom */}
            <div className="absolute bottom-6 left-6 right-6 z-10 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="bg-[var(--color-brand-teal)] text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm">
                    {activeVideo.category}
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-stone-300">
                    Duration: {activeVideo.duration}
                  </span>
                </div>
                <h2 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug max-w-3xl">
                  {activeVideo.title}
                </h2>
                <p className="text-xs text-stone-300 mt-1">
                  Speaker: {activeVideo.speaker} ({activeVideo.speakerRole}, {activeVideo.speakerCompany})
                </p>
              </div>

              <Button variant="coral" size="sm" onClick={onJoin}>
                Download Presentation Slides (.PDF)
              </Button>
            </div>
          </div>
        </div>

        {/* Video Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[var(--color-border-subtle)]">
          {["All", "Panel Discussion", "Knowledge Capsule", "Keynote", "Interview"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--color-brand-teal)] text-white font-semibold"
                  : "bg-white border border-[var(--color-border-subtle)] text-[var(--color-slate-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {filteredVideos.map(video => (
            <div
              key={video.id}
              onClick={() => { setActiveVideo(video); window.scrollTo({ top: 260, behavior: "smooth" }) }}
              className={`bg-white border rounded-sm overflow-hidden flex flex-col justify-between hover:border-[var(--color-brand-teal)]/60 transition-all shadow-sm group cursor-pointer ${
                activeVideo.id === video.id ? "ring-2 ring-[var(--color-brand-teal)]" : "border-[var(--color-border-subtle)]"
              }`}
            >
              <div className="relative h-48 bg-stone-900 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded-sm">
                  {video.duration}
                </span>
                <span className="absolute top-2 left-2 bg-[var(--color-brand-coral)] text-white text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-sm">
                  {video.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-lg font-semibold text-[var(--color-ink)] mb-2 leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-[var(--color-slate-muted)] line-clamp-2 leading-relaxed mb-4">
                    {video.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-slate-muted)]">
                  <span>{video.speaker}</span>
                  <span className="text-[var(--color-brand-teal)] font-medium">Watch Now ▶</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
