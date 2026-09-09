import React, { useState } from "react"

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

const DEFAULT_FALLBACKS = [
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
]

export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc = DEFAULT_FALLBACKS[0],
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setCurrentSrc(fallbackSrc)
    }
  }

  return (
    <img
      src={currentSrc}
      alt={hasError ? "" : alt}
      onError={handleError}
      className={className}
      {...props}
    />
  )
}
