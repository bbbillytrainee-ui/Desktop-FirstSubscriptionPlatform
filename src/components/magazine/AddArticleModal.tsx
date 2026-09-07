import { useState, useRef } from "react"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import { Article } from "../../data/fixtures/articles"
import { AUTHORS, Author } from "../../data/fixtures/authors"

export interface AddArticleModalProps {
  isOpen: boolean
  onClose: () => void
  onAddArticle: (article: Article) => void
}

export default function AddArticleModal({ isOpen, onClose, onAddArticle }: AddArticleModalProps) {
  const [title, setTitle] = useState("")
  const [dek, setDek] = useState("")
  const [category, setCategory] = useState<"Pharma" | "MedTech" | "AI-Health">("Pharma")
  const [format, setFormat] = useState<"Feature" | "Analysis" | "Interview" | "Digest">("Feature")
  const [selectedAuthorId, setSelectedAuthorId] = useState(AUTHORS[0].id)
  const [imageUrl, setImageUrl] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [bodyText, setBodyText] = useState("")
  const [tagsText, setTagsText] = useState("Research, Biopharma, APAC")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result)
          setImageUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (val: string) => {
    setImageUrl(val)
    setImagePreview(val)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dek) return

    const defaultImage = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80"
    const finalImage = imagePreview || imageUrl || defaultImage

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `custom-article-${Date.now()}`

    const newArticle: Article = {
      slug,
      title,
      dek,
      category,
      format,
      issueId: "issue-2026-09",
      authorId: selectedAuthorId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readingTime: "5 min read",
      tags: tagsText.split(",").map(t => t.trim()).filter(Boolean),
      image: finalImage,
      body: bodyText
        ? bodyText.split("\n\n").filter(Boolean)
        : [
            dek,
            "This article was added custom by user. Full editorial evidence, clinical validation data, and regulatory dossiers are available to verified subscribers."
          ],
      isLocked: false,
    }

    onAddArticle(newArticle)
    onClose()

    // Reset fields
    setTitle("")
    setDek("")
    setImageUrl("")
    setImagePreview("")
    setBodyText("")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Article with Custom Image">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
            Article Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Breakthroughs in Single-Use Bioreactors for APAC CDMOs"
            className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
            Subtitle / Tagline (Dek) *
          </label>
          <textarea
            rows={2}
            required
            value={dek}
            onChange={e => setDek(e.target.value)}
            placeholder="Summary breakdown of key operational or regulatory insights..."
            className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Sector Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)] bg-white"
            >
              <option value="Pharma">Pharma</option>
              <option value="MedTech">MedTech</option>
              <option value="AI-Health">AI-Health</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Article Format</label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)] bg-white"
            >
              <option value="Feature">Feature</option>
              <option value="Analysis">Analysis</option>
              <option value="Interview">Interview</option>
              <option value="Digest">Digest</option>
            </select>
          </div>
        </div>

        {/* Writer Selection */}
        <div>
          <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
            ✍️ Select Writer / Author Profile *
          </label>
          <select
            value={selectedAuthorId}
            onChange={e => setSelectedAuthorId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)] bg-white font-medium"
          >
            {AUTHORS.map(aut => (
              <option key={aut.id} value={aut.id}>
                {aut.name} ({aut.role}, {aut.company})
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE UPLOAD & PASTE SECTION */}
        <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm space-y-3">
          <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-brand-coral)] block">
            📷 Article Image Selection
          </span>

          {/* Option 1: File Upload */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
              Option A: Upload Image File from Device
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-[var(--color-slate-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-brand-teal)] file:text-white hover:file:brightness-110 cursor-pointer"
            />
          </div>

          {/* Option 2: Image URL */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">
              Option B: Or Paste Image Web URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
            />
          </div>

          {/* Image Live Preview Box */}
          {imagePreview && (
            <div className="mt-2 pt-2 border-t border-[var(--color-border-subtle)]">
              <span className="text-[10px] font-mono text-[var(--color-slate-muted)] block mb-1">
                Image Live Preview:
              </span>
              <div className="h-36 w-full rounded overflow-hidden border border-stone-300 relative bg-stone-100">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(""); setImageUrl("") }}
                  className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-ink)] mb-1">Article Body Content</label>
          <textarea
            rows={4}
            value={bodyText}
            onChange={e => setBodyText(e.target.value)}
            placeholder="Write paragraphs here. Use empty line between paragraphs..."
            className="w-full px-3 py-2 text-xs border border-[var(--color-border-subtle)] rounded-sm focus:outline-none focus:border-[var(--color-brand-teal)]"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="coral" size="sm" type="submit">
            Add Article to Magazine →
          </Button>
        </div>
      </form>
    </Modal>
  )
}
