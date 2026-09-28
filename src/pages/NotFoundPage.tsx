import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import EmptyState from "../components/ui/EmptyState"

export interface NotFoundPageProps {
  onJoin: () => void
  onNavigate: (route: string) => void
}

export default function NotFoundPage({ onJoin, onNavigate }: NotFoundPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header onJoin={onJoin} onSignIn={onJoin} onNavigate={onNavigate} />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <EmptyState
          className="w-full max-w-xl"
          title="We couldn't find that page"
          description="The link may be outdated, or the page may have moved. Try the latest issue or browse the archive."
          actionLabel="Go to homepage"
          onAction={() => onNavigate("home")}
          secondaryActionLabel="Browse the archive"
          onSecondaryAction={() => onNavigate("archive")}
        />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
