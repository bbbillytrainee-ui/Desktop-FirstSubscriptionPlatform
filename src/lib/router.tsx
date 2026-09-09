import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"

export type RoutePath =
  | "/"
  | "/magazine"
  | "/about"
  | "/professionals"
  | "/companies"
  | "/webinars"
  | "/thought-leadership"
  | "/interviews"
  | "/press-release"
  | "/advertise"
  | "/subscriptions"
  | "/referral"
  | "/archive"
  | "/newsletter"
  | "/rss-feeds"
  | "/events"
  | "/videos"
  | "/podcasts"
  | "/reports"
  | "/trends"
  | "/talent-intent"
  | "/vendors"
  | "/regulatory-navigator"
  | "/enterprise-workspace"
  | "/onboarding"
  | "/dashboard"

const ROUTE_TITLES: Record<string, string> = {
  "/": "Mediverse Life Sciences · Professional Intelligence & Network",
  "/magazine": "Digital Magazine · Mediverse Life Sciences",
  "/about": "About Us · Mediverse Life Sciences",
  "/professionals": "For Healthcare Professionals · Mediverse",
  "/companies": "For Life Science Companies & CDMOs · Mediverse",
  "/webinars": "Live & On-Demand Webinars · Mediverse",
  "/thought-leadership": "Executive Thought Leadership · Mediverse",
  "/interviews": "Leadership Dialogues & Interviews · Mediverse",
  "/press-release": "Corporate Wire & Press Releases · Mediverse",
  "/advertise": "Partner & Advertise With Mediverse",
  "/subscriptions": "Enterprise & Pro Subscriptions · Mediverse",
  "/referral": "Colleague Referral Growth Program · Mediverse",
  "/archive": "Digital Issue Archive · Mediverse",
  "/newsletter": "Daily Intelligence Newsletter · Mediverse",
  "/rss-feeds": "Syndicated RSS Feeds · Mediverse",
  "/events": "Life Science Summits & Conclaves · Mediverse",
  "/videos": "Executive Video Briefings · Mediverse",
  "/podcasts": "Mediverse Dialogues Audio Series",
  "/reports": "Research Reports & Market Intelligence · Mediverse",
  "/trends": "Macro Pharma Trends & Analytics · Mediverse",
  "/talent-intent": "Talent & Leadership Intent Signals · Mediverse",
  "/vendors": "Verified CDMO & Vendor Directory · Mediverse",
  "/regulatory-navigator": "CDSCO & APAC Regulatory Navigator · Mediverse",
  "/enterprise-workspace": "Enterprise Workspace & Team Intelligence",
  "/onboarding": "Join the Network · Mediverse",
  "/dashboard": "Member Dashboard · Mediverse",
}

interface RouterContextType {
  path: string
  route: string
  navigate: (to: string, options?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterContextType>({
  path: "/",
  route: "home",
  navigate: () => {},
})

export const useRouter = () => useContext(RouterContext)

// Normalizes route string from path or named route
export function pathToRoute(pathname: string): string {
  // Support hash routing fallback or clean paths
  let clean = pathname
  if (clean.startsWith("#/")) {
    clean = clean.slice(1)
  } else if (clean.startsWith("#")) {
    clean = "/" + clean.slice(1)
  }

  if (clean === "" || clean === "/") return "home"
  return clean.replace(/^\//, "")
}

export function routeToPath(route: string): string {
  if (route === "home" || route === "" || route === "/") return "/"
  return "/" + route.replace(/^\//, "")
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const getInitialPath = (): string => {
    if (typeof window === "undefined") return "/"
    // If hash path is present, prioritize it
    if (window.location.hash && window.location.hash.startsWith("#/")) {
      return window.location.hash.slice(1)
    }
    return window.location.pathname || "/"
  }

  const [path, setPath] = useState<string>(getInitialPath)

  const updateTitle = (currentPath: string) => {
    const formatted = currentPath === "" || currentPath === "/" ? "/" : "/" + currentPath.replace(/^\//, "")
    const title = ROUTE_TITLES[formatted] || "Mediverse Life Sciences"
    document.title = title
  }

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    // Determine standardized path
    let normalized = to
    if (!normalized.startsWith("/")) {
      normalized = routeToPath(to)
    }

    if (typeof window !== "undefined") {
      if (options?.replace) {
        window.history.replaceState({ path: normalized }, "", normalized)
      } else {
        window.history.pushState({ path: normalized }, "", normalized)
      }
      setPath(normalized)
      updateTitle(normalized)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const current = window.location.pathname || (window.location.hash ? window.location.hash.slice(1) : "/")
      setPath(current)
      updateTitle(current)
    }

    window.addEventListener("popstate", handlePopState)
    updateTitle(path)

    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const currentRoute = pathToRoute(path)

  return (
    <RouterContext.Provider value={{ path, route: currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  children: ReactNode
  replace?: boolean
}

export const Link: React.FC<LinkProps> = ({ to, children, replace = false, className = "", onClick, ...rest }) => {
  const { navigate } = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e)
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault()
      navigate(to, { replace })
    }
  }

  return (
    <a href={to.startsWith("/") ? to : "/" + to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  )
}
