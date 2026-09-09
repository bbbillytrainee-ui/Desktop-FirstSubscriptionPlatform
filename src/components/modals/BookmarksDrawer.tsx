import React from "react"
import { useBookmarks } from "../../lib/bookmarks"
import { Article } from "../../data/fixtures/articles"
import SafeImage from "../ui/SafeImage"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import { BookmarkFilled, X, Trash2, BookOpen, Download, ExternalLink } from "../ui/Icons"
import { useToast } from "../../lib/toast"

export interface BookmarksDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectArticle: (article: Article) => void
  onOpen3DReader?: (article: Article) => void
}

export default function BookmarksDrawer({
  isOpen,
  onClose,
  onSelectArticle,
  onOpen3DReader,
}: BookmarksDrawerProps) {
  const { savedArticles, savedCount, removeBookmark, clearAllBookmarks } = useBookmarks()
  const { success } = useToast()

  if (!isOpen) return null

  const handleExportSavedList = () => {
    if (savedArticles.length === 0) return

    const content = `MEDIVERSE LIFE SCIENCES — SAVED INTELLIGENCE VAULT\nExported: ${new Date().toLocaleDateString()}\nTotal Saved Dossiers: ${savedArticles.length}\n\n` +
      savedArticles.map((art, i) => `${i + 1}. [${art.category}] ${art.title}\n   Subtitle: ${art.dek}\n   Date: ${art.date} | Reading Time: ${art.readingTime}\n   Deep Link: https://mediverse.network/article/${art.slug}\n`).join("\n----------------------------------------\n\n")

    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Mediverse_Saved_Dossiers_Export.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    success("Saved Vault Exported", `Digest of ${savedArticles.length} bookmarked dossiers saved.`)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div className="backdrop-overlay animate-fade-up" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div className="drawer-panel bg-[#0D222A] text-white shadow-2xl flex flex-col justify-between border-l border-stone-700/60 animate-slide-in-right">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-700/80 flex items-center justify-between bg-[#05161C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-coral)]/20 border border-[var(--color-brand-coral)]/40 flex items-center justify-center text-[var(--color-brand-coral)]">
              <BookmarkFilled size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white leading-none mb-1">
                Saved Intelligence Vault
              </h3>
              <span className="font-mono text-[10px] text-stone-400 block uppercase tracking-wider">
                {savedCount} {savedCount === 1 ? "Dossier Saved" : "Dossiers Saved"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-sm text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close bookmarks drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {savedArticles.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-stone-500">
                <BookmarkFilled size={24} />
              </div>
              <h4 className="font-serif text-lg font-semibold text-white">
                Your Reading Vault is Empty
              </h4>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                Click the bookmark icon on any article card or reader to save dossiers for offline study and team review.
              </p>
            </div>
          ) : (
            <>
              {/* Drawer Top Utility Toolbar */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-800">
                <span className="font-mono text-[10px] text-stone-400 uppercase tracking-widest">
                  Bookmarked Articles
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportSavedList}
                    className="font-mono text-[10px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={12} />
                    <span>Export Digest</span>
                  </button>
                  <button
                    onClick={clearAllBookmarks}
                    className="font-mono text-[10px] text-stone-400 hover:text-rose-400 underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Bookmarked Article Cards */}
              <div className="space-y-3">
                {savedArticles.map(article => (
                  <div
                    key={article.slug}
                    className="p-3.5 bg-white/5 hover:bg-white/10 border border-stone-700/70 hover:border-[var(--color-brand-teal)] rounded-md transition-all group relative"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="w-20 h-16 rounded-xs overflow-hidden border border-stone-700 shrink-0 relative bg-stone-900">
                        <SafeImage
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[9px] font-bold text-[var(--color-brand-coral)] uppercase tracking-wider">
                            {article.category}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            · {article.readingTime}
                          </span>
                        </div>

                        <h4
                          onClick={() => {
                            onSelectArticle(article)
                            onClose()
                          }}
                          className="font-serif text-sm font-semibold text-white group-hover:text-[var(--color-brand-teal)] transition-colors line-clamp-2 leading-snug cursor-pointer mb-1"
                        >
                          {article.title}
                        </h4>

                        <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed mb-2">
                          {article.dek}
                        </p>

                        {/* Quick Action Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[10px]">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onSelectArticle(article)
                                onClose()
                              }}
                              className="font-mono text-[var(--color-brand-teal)] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                            >
                              <span>Read Dossier</span>
                              <ExternalLink size={10} />
                            </button>

                            {onOpen3DReader && (
                              <button
                                onClick={() => {
                                  onOpen3DReader(article)
                                  onClose()
                                }}
                                className="font-mono text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <BookOpen size={10} />
                                <span>3D Reader</span>
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => removeBookmark(article.slug)}
                            className="text-stone-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            title="Remove bookmark"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-stone-800 bg-[#05161C] flex justify-between items-center text-[11px] font-mono text-stone-400">
          <span>Saved to local account profile</span>
          <Button variant="coral" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
