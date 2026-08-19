import { useState } from "react"
import Landing from "./components/Landing"
import Onboarding from "./components/Onboarding"
import Dashboard from "./components/Dashboard"

type View = "landing" | "onboarding" | "dashboard"

export default function App() {
  const [view, setView] = useState<View>("landing")

  return (
    <div className="min-h-screen" style={{ background: "#F8F6F0" }}>
      {view === "landing" && (
        <Landing onGetAccess={() => setView("onboarding")} />
      )}
      {view === "onboarding" && (
        <Onboarding onComplete={() => setView("dashboard")} />
      )}
      {view === "dashboard" && <Dashboard />}
    </div>
  )
}
