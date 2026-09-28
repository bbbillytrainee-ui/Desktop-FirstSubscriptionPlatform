export interface AvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(part => /^[A-Za-z]/.test(part) && !part.endsWith("."))
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  }

  return (
    <div
      aria-hidden="true"
      className={`rounded-full bg-[var(--color-brand-teal)] text-[var(--color-paper)] font-semibold flex items-center justify-center shrink-0 ${sizeStyles[size]} ${className}`}
    >
      {initials}
    </div>
  )
}
