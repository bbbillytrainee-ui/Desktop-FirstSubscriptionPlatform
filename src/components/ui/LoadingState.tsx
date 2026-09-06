export interface LoadingStateProps {
  count?: number
  type?: "card" | "article" | "list"
  className?: string
}

export default function LoadingState({ count = 3, type = "card", className = "" }: LoadingStateProps) {
  if (type === "article") {
    return (
      <div className={`flex flex-col gap-6 max-w-[740px] mx-auto py-8 ${className}`}>
        <div className="skeleton h-8 w-3/4" />
        <div className="skeleton h-4 w-1/3 mb-4" />
        <div className="skeleton h-64 w-full mb-6" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    )
  }

  if (type === "list") {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 bg-white border border-[var(--color-border-subtle)] rounded-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
            <div className="skeleton h-8 w-20" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-white border border-[var(--color-border-subtle)] rounded-sm flex flex-col gap-4">
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-6 w-5/6" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-4 w-1/2 mt-auto" />
        </div>
      ))}
    </div>
  )
}
