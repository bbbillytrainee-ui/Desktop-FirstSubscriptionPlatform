import { lazy, Suspense } from "react"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"
import ErrorBoundary from "./components/ui/ErrorBoundary"
import LoadingState from "./components/ui/LoadingState"
import { AuthProvider } from "./lib/auth"
import { RouterProvider, useRouter } from "./lib/router"
import { ToastProvider } from "./lib/toast"
import { BookmarksProvider } from "./lib/bookmarks"
import { ThemeProvider } from "./lib/theme"

// Home + 404 ship in the main bundle; every other screen is split into its own chunk
const MagazinePage = lazy(() => import("./pages/MagazinePage"))
const AboutPage = lazy(() => import("./pages/AboutPage"))
const ProfessionalsPage = lazy(() => import("./pages/ProfessionalsPage"))
const CompaniesPage = lazy(() => import("./pages/CompaniesPage"))
const WebinarsPage = lazy(() => import("./pages/WebinarsPage"))
const ThoughtLeadershipPage = lazy(() => import("./pages/ThoughtLeadershipPage"))
const InterviewsPage = lazy(() => import("./pages/InterviewsPage"))
const PressReleasePage = lazy(() => import("./pages/PressReleasePage"))
const AdvertisePage = lazy(() => import("./pages/AdvertisePage"))
const SubscriptionsPage = lazy(() => import("./pages/SubscriptionsPage"))
const ArchivePage = lazy(() => import("./pages/ArchivePage"))
const NewsletterPage = lazy(() => import("./pages/NewsletterPage"))
const RssFeedsPage = lazy(() => import("./pages/RssFeedsPage"))
const EventsPage = lazy(() => import("./pages/EventsPage"))
const VideosPage = lazy(() => import("./pages/VideosPage"))
const PodcastsPage = lazy(() => import("./pages/PodcastsPage"))
const ReportsPage = lazy(() => import("./pages/ReportsPage"))
const TrendIntelligencePage = lazy(() => import("./pages/TrendIntelligencePage"))
const TalentIntentPage = lazy(() => import("./pages/TalentIntentPage"))
const VendorsDirectoryPage = lazy(() => import("./pages/VendorsDirectoryPage"))
const RegulatoryNavigatorPage = lazy(() => import("./pages/RegulatoryNavigatorPage"))
const EnterpriseWorkspacePage = lazy(() => import("./pages/EnterpriseWorkspacePage"))
const ReferralPage = lazy(() => import("./pages/ReferralPage"))
const ArticlePage = lazy(() => import("./pages/ArticlePage"))
const Onboarding = lazy(() => import("./components/Onboarding"))
const Dashboard = lazy(() => import("./components/Dashboard"))

// Warm the chunks people most often open next, once the browser is idle
const prefetchLikelyNext = () => {
  void import("./pages/ArticlePage")
  void import("./pages/MagazinePage")
  void import("./components/Onboarding")
}
if (typeof window !== "undefined") {
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
  if (idle) idle(prefetchLikelyNext)
  else window.setTimeout(prefetchLikelyNext, 2000)
}

function PageFallback() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="min-h-screen">
      <div className="h-16 border-b border-[var(--color-border-subtle)]" />
      <div className="max-w-[var(--container-max)] mx-auto px-6 py-12">
        <LoadingState type="article" />
      </div>
    </div>
  )
}

const KNOWN_ROUTES = new Set([
  "home", "", "magazine", "about", "professionals", "companies", "webinars", "thought-leadership",
  "interviews", "press-release", "advertise", "subscriptions", "referral", "archive", "newsletter",
  "rss-feeds", "events", "videos", "podcasts", "reports", "trends", "talent-intent", "vendors",
  "regulatory-navigator", "enterprise-workspace", "onboarding", "dashboard",
])

function AppRoutes() {
  const { route, path, navigate } = useRouter()

  const articleSlug = route.startsWith("article/") ? decodeURIComponent(route.slice("article/".length)) : null

  const handleNavigate = (target: string) => {
    navigate(target)
  }

  const handleJoin = () => {
    navigate("onboarding")
  }

  // Keyed by full path (incl. ?topic=) so in-app links to a filtered Home remount it
  return (
    <div key={path} className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] animate-route-in">
      {/* Skip link: first Tab stop on every page; moves focus to the page's <main> */}
      <a
        href="#main-content"
        onClick={e => {
          const main = document.querySelector("main")
          if (!main) return
          e.preventDefault()
          main.setAttribute("tabindex", "-1")
          main.focus({ preventScroll: true })
          main.scrollIntoView()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-3 focus:rounded-control focus:bg-[var(--color-section-dark)] focus:text-white focus:text-sm focus:font-semibold focus:shadow-overlay"
      >
        Skip to content
      </a>
      <ErrorBoundary onReset={() => navigate("home")}>
      <Suspense fallback={<PageFallback />}>
      {articleSlug && <ArticlePage slug={articleSlug} onJoin={handleJoin} onNavigate={handleNavigate} />}
      {!articleSlug && !KNOWN_ROUTES.has(route) && <NotFoundPage onJoin={handleJoin} onNavigate={handleNavigate} />}
      {(route === "home" || route === "") && (
        <HomePage
          onGetAccess={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "magazine" && (
        <MagazinePage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "about" && (
        <AboutPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "professionals" && (
        <ProfessionalsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "companies" && (
        <CompaniesPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "webinars" && (
        <WebinarsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "thought-leadership" && (
        <ThoughtLeadershipPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "interviews" && (
        <InterviewsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "press-release" && (
        <PressReleasePage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "advertise" && (
        <AdvertisePage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "subscriptions" && (
        <SubscriptionsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "referral" && (
        <ReferralPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "archive" && (
        <ArchivePage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "newsletter" && (
        <NewsletterPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "rss-feeds" && (
        <RssFeedsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "events" && (
        <EventsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "videos" && (
        <VideosPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "podcasts" && (
        <PodcastsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "reports" && (
        <ReportsPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "trends" && (
        <TrendIntelligencePage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "talent-intent" && (
        <TalentIntentPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "vendors" && (
        <VendorsDirectoryPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "regulatory-navigator" && (
        <RegulatoryNavigatorPage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "enterprise-workspace" && (
        <EnterpriseWorkspacePage
          onJoin={handleJoin}
          onNavigate={handleNavigate}
        />
      )}
      {route === "onboarding" && (
        <Onboarding onComplete={() => navigate("dashboard")} />
      )}
      {route === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
      </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <ToastProvider>
            <BookmarksProvider>
              <AppRoutes />
            </BookmarksProvider>
          </ToastProvider>
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
