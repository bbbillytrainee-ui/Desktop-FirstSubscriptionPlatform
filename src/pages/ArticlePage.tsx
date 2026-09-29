import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import ArticleReader from "../components/magazine/ArticleReader"
import MagazineFlipbook from "../components/magazine/LazyMagazineFlipbook"
import NotFoundPage from "./NotFoundPage"
import { ARTICLES } from "../data/fixtures/articles"
import { ISSUES } from "../data/fixtures/issues"
import { articleRoute } from "../lib/router"
import { useReaderPrefs } from "../lib/readerPrefs"
import { fetchDossier, type ApiArticle } from "../lib/api"
import { useSession } from "../lib/session"

export interface ArticlePageProps {
  slug: string
  onJoin: () => void
  onNavigate: (route: string) => void
}


export default function ArticlePage({ slug, onJoin, onNavigate }: ArticlePageProps) {
  const article = ARTICLES.find(a => a.slug === slug)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const [{ focus }, setPrefs] = useReaderPrefs()
  const session = useSession()
  const [remote, setRemote] = useState<ApiArticle | null>(null)

  // Backend connected: fetch with the reader's token (refetched on sign-in / sign-out).
  // If the API is unreachable the page keeps the built-in content, so it never breaks.
  useEffect(() => {
    if (!session.enabled || session.restoring) return
    let alive = true
    fetchDossier(slug, { token: session.token })
      .then(a => alive && setRemote(a))
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [slug, session.enabled, session.restoring, session.token])

  // Leaving the page always leaves focus mode
  useEffect(() => () => setPrefs({ focus: false }), [setPrefs])

  useEffect(() => {
    if (article) document.title = `${article.title} · Mediverse`
  }, [article])

  if (!article) return <NotFoundPage onJoin={onJoin} onNavigate={onNavigate} />

  const fromApi = remote?.slug === slug ? remote : null
  // Until the server answers, a locked piece shows only its opening paragraph (never the full text)
  const shown = fromApi ?? (session.enabled && article.isLocked ? { ...article, body: article.body.slice(0, 1) } : article)
  const paywall = session.enabled
    ? {
        truncated: fromApi ? fromApi.bodyTruncated : article.isLocked === true,
        shown: shown.body.length,
        total: fromApi ? fromApi.paragraphCount : article.body.length,
        signedIn: session.user !== null,
        onSignIn: () => session.openSignIn(),
      }
    : undefined

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
          article={shown}
          paywall={paywall}
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
