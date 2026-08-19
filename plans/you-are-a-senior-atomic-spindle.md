# Plan: Pharma/MedTech Editorial Platform — "Mineral & Ink"

## Context

Build a desktop-first subscription platform for Pharma/MedTech/AI-Health professionals. The product is a "work magazine + professional network": editorial reading (Magazine tab), monthly match drops (Matches tab), and a contributor directory (Contacts tab). The aesthetic is "Mineral & Ink" — authoritative, quiet, credible like a serious trade publication. No clinical blue, no warm-cream-terracotta startup clichés.

**Self-Critique / Avoid List Check:** The brief explicitly forbids: centered-text generic SaaS hero, clinical blue, terracotta, acid-green, newspaper skeuomorphism. Instead: asymmetric editorial split-hero, deep charcoal + Scientific Saffron highlights + Paper White, "Binding Line" vertical rule as structural motif.

---

## Stance Commitment

- **Stance:** Editorial Minimalist — one dominant visual element per section, generous whitespace, typography as primary design element
- **Display font:** Newsreader (Google Fonts serif — editorial authority for headlines, pull-quotes, drop-caps)
- **Body font:** Inter (Google Fonts sans — crisp, readable for utility data, body copy, UI chrome)
- **Palette:**
  - `--background: #F8F6F0` (Paper White)
  - `--foreground: #1A1A1A` (Deep Charcoal)
  - `--primary: #1A1A1A`
  - `--accent: #D4A373` (Scientific Saffron — highlights, underlines, pills only)
  - `--muted-foreground: #5A6B7C` (Slate Grey)
  - `--border: rgba(26,26,26,0.12)`
  - Binding Line: 1px solid `#1A1A1A` at 15% opacity, fixed left rail

---

## Architecture

Single-page React app with local state routing: `view` → `'landing' | 'onboarding' | 'dashboard'`. No router library needed.

**Files to create/modify:**

| File | Action |
|------|--------|
| `src/index.css` | Add Google Fonts imports (Newsreader, Inter), define CSS custom properties for Mineral & Ink palette |
| `src/App.tsx` | App shell — manages `view` state, renders Landing / Onboarding / Dashboard |
| `src/components/Landing.tsx` | Asymmetric split-hero (60/40 grid), bold 64px display headline, CTA left; live magazine-grid mockup right |
| `src/components/Onboarding.tsx` | 3-step modal (700px card): Tag chips → Goal radio cards → Notification toggle |
| `src/components/Dashboard.tsx` | Shell with Binding Line, top nav, 3 tabs |
| `src/components/MagazineTab.tsx` | CSS Grid editorial layout: hero card (2-col span) + 3-col masonry, sticky sidebar, Read Time pills, pull-quote, drop-cap |
| `src/components/MatchesTab.tsx` | Sortable match list with "Matched on: X + Y" logic badges; monthly drop stagger animation via CSS keyframes |
| `src/components/ContactsTab.tsx` | Filterable grid with Contributor badge (solid saffron fill) vs. Member badge (outline) |

---

## Key Implementation Details

### Fonts (src/index.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import 'tailwindcss';
```

### Binding Line
A fixed `1px` left vertical rule inside the dashboard layout, `position: sticky` on the left rail column of the CSS Grid. Visual signature encoding "monthly issue" structure.

### Magazine Grid
```
[hero hero] [sidebar]
[card] [card] [sidebar]  ← 2fr 2fr 1fr column template
```
- Hero card: `grid-column: span 2`, large image placeholder with molecular SVG overlay, drop-cap first paragraph
- Read Time pill: saffron-background pill badge, bottom-left of each card
- Pull-quote: `font-family: Newsreader`, `font-style: italic`, left-border in saffron, `font-size: 1.5rem`

### Matches — Monthly Drop Animation
CSS `@keyframes cardDeal` with `opacity: 0 → 1` + `translateY(20px → 0)`. Apply to each `.match-card` with `animation-delay: calc(var(--i) * 120ms)`. Triggered on mount via `[data-deal="true"]` class. Every other interaction in the product has `transition: none` to preserve this as the single motion moment.

### Onboarding
- Step 1: Tag chips (pharma subcategories like "Gene Therapy", "AI Diagnostics", "Regulatory Affairs") with a counter showing `X/5 selected` in saffron when ≥3 chosen
- Step 2: 4 large radio cards (140px tall) with icon + label
- Step 3: Toggle with exact copy "Notify me the day my monthly matches drop."

### Contacts Badges
- Contributor: `background: #D4A373; color: #1A1A1A; font-weight: 600` — solid saffron fill
- Member: `border: 1.5px solid #5A6B7C; color: #5A6B7C` — slate outline

---

## Realistic Content

Magazine articles on: CRISPR patent landscape, FDA AI guidance framework, MedTech VC deal flow Q3, mRNA vaccine supply chain. Match personas: Dr. Ananya Krishnamurthy (regulatory affairs, Pfizer), Marcus Osei-Bonsu (BD at Medtronic), etc. Contacts directory with real-looking names, titles, organizations.

---

## Verification

1. App loads at localhost:8443 showing the Landing hero
2. "Get Early Access" → Onboarding flow, all 3 steps navigable
3. "Enter Platform" → Dashboard loads on Magazine tab
4. Tab switching: Magazine → Matches → Contacts all functional
5. Matches tab: cards stagger in on mount with deal animation
6. Contacts: filter buttons update visible cards
7. Typography hierarchy visible: Newsreader serif display + Inter sans body
8. Binding line visible on left rail in Dashboard
9. Saffron accent appears only on highlights/pills/badges (not as primary UI color)
10. No blue, no terracotta, no clinical visual language anywhere
