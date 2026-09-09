import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
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

const LOCAL_STORAGE_KEY = "mediverse_user_bookmarks_v1"

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { bookmark } = useToast()

  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      return stored ? JSON.parse(stored) : ["continuous-biomanufacturing-cdmo-scaleup-2026", "cdsco-samd-ai-regulatory-framework"]
    } catch {
      return ["continuous-biomanufacturing-cdmo-scaleup-2026"]
    }
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedSlugs))
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e)
    }
  }, [savedSlugs])

  const isBookmarked = useCallback((slug: string) => {
    return savedSlugs.includes(slug)
  }, [savedSlugs])

  const toggleBookmark = useCallback((article: Article) => {
    setSavedSlugs(prev => {
      const exists = prev.includes(article.slug)
      if (exists) {
        bookmark("Removed from Dossier Vault", `"${article.title.slice(0, 36)}..." removed from saved library.`)
        return prev.filter(s => s !== article.slug)
      } else {
        bookmark("Saved to Dossier Vault", `"${article.title.slice(0, 36)}..." added to saved reading list.`)
        return [article.slug, ...prev]
      }
    })
  }, [bookmark])

  const removeBookmark = useCallback((slug: string) => {
    setSavedSlugs(prev => {
      const art = ARTICLES.find(a => a.slug === slug)
      if (art) {
        bookmark("Bookmark Removed", `"${art.title.slice(0, 36)}..." removed from library.`)
      }
      return prev.filter(s => s !== slug)
    })
  }, [bookmark])

  const clearAllBookmarks = useCallback(() => {
    setSavedSlugs([])
    bookmark("Vault Cleared", "All saved article bookmarks have been cleared.")
  }, [bookmark])

  const savedArticles = ARTICLES.filter(a => savedSlugs.includes(a.slug))

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
