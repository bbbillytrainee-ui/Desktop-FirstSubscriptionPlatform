import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import ArticleReader from "../components/magazine/ArticleReader"
import MagazineFlipbook from "../components/magazine/MagazineFlipbook"
import NotFoundPage from "./NotFoundPage"
import { ARTICLES } from "../data/fixtures/articles"
import { ISSUES } from "../data/fixtures/issues"
import { articleRoute } from "../lib/router"
import { useReaderPrefs } from "../lib/readerPrefs"

export interface ArticlePageProps {
  slug: string
  onJoin: () => void
  onNavigate: (route: string) => void
}


export default function ArticlePage({ slug, onJoin, onNavigate }: ArticlePageProps) {
  const article = ARTICLES.find(a => a.slug === slug)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [{ focus }, setPrefs] = useReaderPrefs()

  // Leaving the page always leaves focus mode
  useEffect(() => () => setPrefs({ focus: false }), [setPrefs])

  useEffect(() => {
    if (article) document.title = `${article.title} · Mediverse`
  }, [article])

  if (!article) return <NotFoundPage onJoin={onJoin} onNavigate={onNavigate} />

  const issue = ISSUES.find(i => i.id === article.issueId) ?? ISSUES[0]
  const issueArticles = ARTICLES.filter(a => a.issueId === issue.id)

  // Back returns to wherever the reader came from in-app (keeps topic + scroll); deep links go home
  const handleClose = () => {
    if (window.history.state?.path) window.history.back()
    else onNavigate("home")
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans">
      {showFlipbook && (
        <MagazineFlipbook
          issue={issue}
          articles={issueArticles.length > 0 ? issueArticles : ARTICLES}
          onClose={() => setShowFlipbook(false)}
          onJoinPrompt={onJoin}
        />
      )}
      {!focus && <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />}
      <main className="flex-1 py-8">
        <ArticleReader
          key={article.slug}
          article={article}
          onClose={handleClose}
          onJoinPrompt={onJoin}
          onOpenFlipbook={() => setShowFlipbook(true)}
          onOpenArticle={next => onNavigate(articleRoute(next.slug))}
        />
      </main>
      {!focus && <Footer onNavigate={onNavigate} />}
    </div>
  )
}
