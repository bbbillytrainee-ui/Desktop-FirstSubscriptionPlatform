import Landing from "../components/Landing"

export interface HomePageProps {
  onGetAccess: () => void
  onNavigate?: (route: string) => void
}

export default function HomePage({ onGetAccess, onNavigate }: HomePageProps) {
  return <Landing onGetAccess={onGetAccess} onNavigate={onNavigate} />
}
