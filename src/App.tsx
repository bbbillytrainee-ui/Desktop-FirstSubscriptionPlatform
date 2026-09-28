import HomePage from "./pages/HomePage"
import MagazinePage from "./pages/MagazinePage"
import AboutPage from "./pages/AboutPage"
import ProfessionalsPage from "./pages/ProfessionalsPage"
import CompaniesPage from "./pages/CompaniesPage"
import WebinarsPage from "./pages/WebinarsPage"
import ThoughtLeadershipPage from "./pages/ThoughtLeadershipPage"
import InterviewsPage from "./pages/InterviewsPage"
import PressReleasePage from "./pages/PressReleasePage"
import AdvertisePage from "./pages/AdvertisePage"
import SubscriptionsPage from "./pages/SubscriptionsPage"
import ArchivePage from "./pages/ArchivePage"
import NewsletterPage from "./pages/NewsletterPage"
import RssFeedsPage from "./pages/RssFeedsPage"
import EventsPage from "./pages/EventsPage"
import VideosPage from "./pages/VideosPage"
import PodcastsPage from "./pages/PodcastsPage"
import ReportsPage from "./pages/ReportsPage"
import TrendIntelligencePage from "./pages/TrendIntelligencePage"
import TalentIntentPage from "./pages/TalentIntentPage"
import VendorsDirectoryPage from "./pages/VendorsDirectoryPage"
import RegulatoryNavigatorPage from "./pages/RegulatoryNavigatorPage"
import EnterpriseWorkspacePage from "./pages/EnterpriseWorkspacePage"
import ReferralPage from "./pages/ReferralPage"
import NotFoundPage from "./pages/NotFoundPage"
import ArticlePage from "./pages/ArticlePage"
import Onboarding from "./components/Onboarding"
import Dashboard from "./components/Dashboard"
import ErrorBoundary from "./components/ui/ErrorBoundary"
import { AuthProvider } from "./lib/auth"
import { RouterProvider, useRouter } from "./lib/router"
import { ToastProvider } from "./lib/toast"
import { BookmarksProvider } from "./lib/bookmarks"
import { ThemeProvider } from "./lib/theme"

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
