import { lazy, Suspense, type ComponentProps } from "react"

// The 3D reader (and the PDF generator it imports) load only when a reader is opened
const MagazineFlipbook = lazy(() => import("./MagazineFlipbook"))

type Props = ComponentProps<typeof MagazineFlipbook>

export default function LazyMagazineFlipbook(props: Props) {
  return (
    <Suspense
      fallback={
        <div role="status" aria-live="polite" className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(7,20,26,0.7)] backdrop-blur-sm text-white text-sm">
          Opening the reader…
        </div>
      }
    >
      <MagazineFlipbook {...props} />
    </Suspense>
  )
}
