import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { Article, ARTICLES } from "../data/fixtures/articles"
import { useToast } from "./toast"

export interface BookmarksContextType {
  savedSlugs: string[]
  savedArticles: Article[]
  savedCount: number
  isBookmarked: (slug: string) => boolean
  toggleBookmark: (article: Article) => void
  removeBookmark: (slug: string) => void
  clearAllBookmarks: () => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

// v2: v1 was pre-seeded with demo bookmarks, so every visitor started with "Saved (2)"
const LOCAL_STORAGE_KEY = "mediverse_user_bookmarks_v2"

const shortTitle = (title: string) => (title.length > 48 ? `${title.slice(0, 46)}…` : title)

const readStored = (): string[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : []
  } catch {
    return []
  }
}

/** Re-inserts a slug at its previous position (used by Undo). */
const insertAt = (list: string[], slug: string, index: number) =>
  list.includes(slug) ? list : [...list.slice(0, index), slug, ...list.slice(index)]

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bookmark } = useToast()
  const [savedSlugs, setSavedSlugs] = useState<string[]>(readStored)

  // Latest list for event handlers, so toasts are decided outside state updaters
  const slugsRef = useRef(savedSlugs)
  slugsRef.current = savedSlugs

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedSlugs))
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e)
    }
  }, [savedSlugs])

  const isBookmarked = useCallback((slug: string) => savedSlugs.includes(slug), [savedSlugs])

  const removeBookmark = useCallback((slug: string) => {
    const index = slugsRef.current.indexOf(slug)
    if (index === -1) return
    setSavedSlugs(prev => prev.filter(s => s !== slug))
    const article = ARTICLES.find(a => a.slug === slug)
    bookmark("Removed from saved", article ? shortTitle(article.title) : undefined, {
      label: "Undo",
      onClick: () => setSavedSlugs(prev => insertAt(prev, slug, index)),
    })
  }, [bookmark])

  const toggleBookmark = useCallback((article: Article) => {
    if (slugsRef.current.includes(article.slug)) {
      removeBookmark(article.slug)
      return
    }
    setSavedSlugs(prev => (prev.includes(article.slug) ? prev : [article.slug, ...prev]))
    bookmark("Saved for later", shortTitle(article.title), {
      label: "Undo",
      onClick: () => setSavedSlugs(prev => prev.filter(s => s !== article.slug)),
    })
  }, [bookmark, removeBookmark])

  const clearAllBookmarks = useCallback(() => {
    const previous = slugsRef.current
    if (previous.length === 0) return
    setSavedSlugs([])
    bookmark("Cleared saved articles", `${previous.length} article${previous.length === 1 ? "" : "s"} removed.`, {
      label: "Undo",
      onClick: () => setSavedSlugs(previous),
    })
  }, [bookmark])

  const savedArticles = savedSlugs
    .map(slug => ARTICLES.find(a => a.slug === slug))
    .filter((a): a is Article => Boolean(a))

  return (
    <BookmarksContext.Provider
      value={{
        savedSlugs,
        savedArticles,
        savedCount: savedSlugs.length,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        clearAllBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks(): BookmarksContextType {
  const context = useContext(BookmarksContext)
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider")
  }
  return context
}
