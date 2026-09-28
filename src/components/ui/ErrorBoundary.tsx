import { Component, type ReactNode } from "react"
import EmptyState from "./EmptyState"

export interface ErrorBoundaryProps {
  children: ReactNode
  onReset?: () => void
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("Unhandled UI error:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto px-6 py-20">
          <EmptyState
            title="Something went wrong on this page"
            description="Your data is safe. Reload the page to try again, or head back to the homepage."
            actionLabel="Reload page"
            onAction={() => window.location.reload()}
            secondaryActionLabel="Go to homepage"
            onSecondaryAction={() => {
              this.setState({ hasError: false })
              this.props.onReset?.()
            }}
          />
        </div>
      )
    }
    return this.props.children
  }
}
