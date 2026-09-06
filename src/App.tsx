import { useState } from "react"
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
import Onboarding from "./components/Onboarding"
import Dashboard from "./components/Dashboard"
import { AuthProvider } from "./lib/auth"

type Route =
  | "home"
  | "magazine"
  | "about"
  | "professionals"
  | "companies"
  | "webinars"
  | "thought-leadership"
  | "interviews"
  | "press-release"
  | "advertise"
  | "subscriptions"
  | "referral"
  | "archive"
  | "newsletter"
  | "rss-feeds"
  | "events"
  | "videos"
  | "podcasts"
  | "reports"
  | "trends"
  | "talent-intent"
  | "vendors"
  | "regulatory-navigator"
  | "enterprise-workspace"
  | "onboarding"
  | "dashboard"


function AppContent() {
  const [route, setRoute] = useState<Route>("home")

  const navigate = (r: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setRoute(r as Route)
  }

  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {route === "home" && (
        <HomePage
          onGetAccess={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "magazine" && (
        <MagazinePage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "about" && (
        <AboutPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "professionals" && (
        <ProfessionalsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "companies" && (
        <CompaniesPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "webinars" && (
        <WebinarsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "thought-leadership" && (
        <ThoughtLeadershipPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "interviews" && (
        <InterviewsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "press-release" && (
        <PressReleasePage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "advertise" && (
        <AdvertisePage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "subscriptions" && (
        <SubscriptionsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "referral" && (
        <ReferralPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}

      {route === "archive" && (
        <ArchivePage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "newsletter" && (
        <NewsletterPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "rss-feeds" && (
        <RssFeedsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "events" && (
        <EventsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "videos" && (
        <VideosPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "podcasts" && (
        <PodcastsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "reports" && (
        <ReportsPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "trends" && (
        <TrendIntelligencePage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "talent-intent" && (
        <TalentIntentPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "vendors" && (
        <VendorsDirectoryPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "regulatory-navigator" && (
        <RegulatoryNavigatorPage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "enterprise-workspace" && (
        <EnterpriseWorkspacePage
          onJoin={() => navigate("onboarding")}
          onNavigate={navigate}
        />
      )}
      {route === "onboarding" && (
        <Onboarding onComplete={() => navigate("dashboard")} />
      )}
      {route === "dashboard" && <Dashboard />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
