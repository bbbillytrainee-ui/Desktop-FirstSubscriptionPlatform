import React, { useEffect, useRef, useState } from "react"

export interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "width"> {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  /** Rendered CSS width in px; Unsplash images are requested at this size (1x/2x srcset) */
  width?: number
  /** Show a blurred 24px copy underneath until the full image loads (Unsplash only; parent must be relative) */
  blurUp?: boolean
}

const DEFAULT_FALLBACKS = [
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
]

/** Returns the URL resized via Unsplash's `w` param; other hosts are returned unchanged. */
const sized = (url: string, w: number) => {
  try {
    const u = new URL(url)
    if (u.hostname !== "images.unsplash.com") return url
    u.searchParams.set("w", String(Math.round(w)))
    u.searchParams.set("auto", "format")
    return u.toString()
  } catch {
    return url
  }
}

/**
 * Image with fallback on error, lazy loading by default, right-sized Unsplash
 * requests and a fade-in once loaded (the parent should reserve space via aspect-ratio).
 */
export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc = DEFAULT_FALLBACKS[0],
  width,
  loading = "lazy",
  blurUp = false,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setCurrentSrc(src)
    setHasError(false)
  }, [src])

  // Cached images can finish before onLoad is attached
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true)
  }, [currentSrc])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setCurrentSrc(fallbackSrc)
    }
  }

  const responsive = width
    ? { src: sized(currentSrc, width), srcSet: `${sized(currentSrc, width)} 1x, ${sized(currentSrc, width * 2)} 2x` }
    : { src: currentSrc }

  const placeholder = blurUp && sized(currentSrc, 24) !== currentSrc ? sized(currentSrc, 24) : null

  const image = (
    <img
      ref={ref}
      {...responsive}
      alt={hasError ? "" : alt}
      loading={loading}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={handleError}
      className={`transition-opacity duration-[var(--duration-slow)] ${loaded ? "opacity-100" : "opacity-0"} ${placeholder ? "relative" : ""} ${className}`}
      {...props}
    />
  )

  if (!placeholder) return image
  return (
    <>
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-[var(--duration-slow)] ${loaded ? "opacity-0" : "opacity-100"}`}
      />
      {image}
    </>
  )
}
