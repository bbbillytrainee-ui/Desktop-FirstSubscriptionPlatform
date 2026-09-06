# Frontend Build Plan

## Pharma x MedTech x AI-Health Network

This is the frontend product and growth brief for a professional network that combines an editorial magazine, trusted discovery, and structured introductions across healthcare innovation.

It uses the existing brand kit as a design language reference. It does not reproduce the iLearn CRI website, its logo, its page copy, or its visual composition. The goal is an original product with the same level of brand discipline.

## 1. Product Thesis

The first version should sell a useful professional reading habit before it promises a powerful network effect.

The product hierarchy is:

1. **Magazine:** the reliable monthly reason to return and subscribe.
2. **Discovery:** a searchable, structured view of people and expertise.
3. **Matches:** a small number of explainable introductions that become more valuable as the network grows.

The frontend must make this sequence obvious. A visitor should understand the editorial value within seconds, see how the network is different, and only then be asked to join.

### Positioning

> A serious publication and professional network for the people building what healthcare becomes next.

### Competitive angle

Do not compete with daily healthcare news on speed, with general social networks on volume, or with academic databases on paper discovery. Own the intersection of:

- curated monthly intelligence;
- cross-disciplinary professionals who do not naturally meet;
- explainable, permission-based introductions;
- a focused Pharma, MedTech, and AI-Health point of view.

The visible product distinction should be **editorial judgement plus useful connection**, not AI decoration or an invented compatibility score.

## 2. Audience And Business Journey

Design for three audiences, while keeping one coherent brand.

| Audience | Primary need | Frontend promise | Main conversion |
| --- | --- | --- | --- |
| Early-career professional | Learn, be visible, find mentors | A credible place to learn and be discovered | Join free / create profile |
| Industry professional or manager | Make better decisions and find relevant people | High-signal monthly intelligence and introductions | Start Professional trial |
| Company or ecosystem partner | Reach a qualified specialist audience | Thought leadership and trusted access to a focused network | Request a conversation |

### Business rules reflected in the UI

- Keep a free entry point so the network can reach useful density.
- Keep premium value around the full magazine, better discovery, and higher-quality introductions.
- Treat company conversion as a separate sales journey, not a fourth dashboard tab.
- Do not display unsupported social-proof numbers, logos, testimonials, or match-performance claims. Use real proof only after it exists.
- Never imply that a match is an endorsement, medical recommendation, or guarantee of business quality.

## 3. Existing Application Direction

The current React flow is a useful prototype foundation:

```text
Landing -> Onboarding -> Dashboard
```

Keep React + Vite for this frontend phase. Do not restart the project in another framework while the information architecture and product promise are still being validated.

The authenticated product has exactly three primary destinations:

```text
Matches | Magazine | Contacts
```

The Magazine is the default landing destination after sign-in for new or low-density accounts. A user with a fresh monthly drop can land on Matches instead. This can be controlled by frontend state initially and by the backend later.

## 4. Information Architecture

### Public routes

```text
/
/magazine
/magazine/:issue
/article/:slug
/about
/professionals
/companies
/join
/sign-in
/privacy
/terms
```

### Product routes

```text
/app/matches
/app/magazine
/app/contacts
```

### Later routes

```text
/authors/:slug
/companies/:slug
/settings
/brand
```

Use route-level page components even if the prototype initially uses local view state. This keeps the frontend migration to a router or server-rendered framework straightforward later.

## 5. Homepage Specification

The homepage is a conversion page, not a dashboard preview and not a generic startup landing page.

### Above the fold

- Compact header with wordmark, Magazine, About, For Professionals, For Companies, Sign in, and Join.
- One clear headline focused on the professional audience and future of healthcare.
- One supporting sentence explaining the editorial-plus-network model in plain language.
- Primary CTA: `Join the network`.
- Secondary CTA: `Read the latest issue`.
- A visible editorial artifact: issue cover, feature headline, or sharply framed scientific/industrial image.
- A small label such as `PHARMA / MEDTECH / AI-HEALTH` to establish the category.

Do not put a pricing table or a large abstract AI graphic above the fold. The next section must be partially visible so the page feels like an editorial destination, not a blank marketing canvas.

### Homepage section order

1. Header and focused hero.
2. Latest issue feature with real article titles.
3. The three-lane editorial point of view: Pharma, MedTech, AI-Health.
4. How the network works: read, refine your interests, receive relevant introductions.
5. Magazine preview with one feature and supporting articles.
6. Discovery preview showing expertise, role, and reason-for-match metadata.
7. Audience-specific paths for professionals and companies.
8. Pricing teaser after value has been established.
9. Editorial or member proof, only when verified.
10. Final join CTA and a calm footer with legal links.

### Homepage copy rules

- Be specific about what is published and who it is for.
- Explain “matching” as introductions based on professional interests and goals.
- Avoid “revolutionary,” “unlock,” “seamless,” “next-generation,” and similar empty claims.
- Do not call the product an AI platform. AI is an implementation detail, while editorial judgement and professional relevance are the user benefit.

## 6. Magazine Experience

The Magazine is the core frontend surface for the first six months.

### Magazine index

- Current issue header with issue number, month, theme, and short editor’s note.
- Featured story with a large, inspectable image.
- Browse controls for Pharma, MedTech, AI-Health, and format.
- Article grid with clear hierarchy: feature, interview, analysis, digest, contributor piece.
- Search-ready article metadata: category, author, reading time, date.
- Persistent `Latest issue` access in the public header.
- Empty, loading, and no-results states that still feel editorially intentional.

### Article page

- Category and issue metadata above the title.
- Fraunces headline, Geist body, Geist Mono metadata.
- Author role and company shown prominently, with contributor status where relevant.
- Reading progress or compact article navigation for long pieces.
- Related articles based on category and tags.
- Share controls with accessible labels.
- Standing informational disclaimer where an article touches clinical or health topics.
- Sign-up prompt at a natural reading boundary, never as an aggressive interruption.

### Editorial content model for frontend fixtures

```text
Issue: id, number, month, theme, summary, coverImage, status
Article: slug, title, dek, category, format, issue, author, date, readingTime, tags, image, body
Author: name, role, company, bio, avatar, linkedin, isContributor
```

The content model must support real CMS data later. Do not build article cards around hardcoded layout assumptions that only fit one headline length.

## 7. Matching Experience

Matches are a trust surface. Clarity matters more than visual novelty.

### Monthly match drop

- Header states the month and number of new introductions.
- Each card leads with person, role, company, location, and relevant expertise.
- Show `Matched on: AI diagnostics + regulatory affairs` or equivalent human-readable reasons.
- Include a short “why this could be useful” explanation.
- Primary action: `Connect`.
- Secondary action: `Not relevant`.
- Provide a short feedback confirmation after either action.
- Never show a percentage, ranking, compatibility label, or unexplained score.

### Match states

Design all of these before polishing the happy path:

- first visit with no matches yet;
- new monthly matches;
- all matches reviewed;
- connection sent;
- dismissed match with undo window;
- low-density network with an honest explanation;
- loading and error states;
- consent not granted;
- premium-gated action.

The empty state should direct users back to the Magazine or profile refinement rather than making the network feel broken.

## 8. Contacts Experience

Contacts is a professional directory, not a social feed.

### Required interaction model

- Search by name, role, company, expertise, and location.
- Filter by vertical, role type, contributor/member status, and topic.
- Use compact cards or a dense list on desktop; stack readable cards on mobile.
- Open a profile drawer or detail page without losing the current filter state.
- Show badges only for meaningful states: Contributor, Verified professional, or Member.
- Hide personal contact details unless the product permission model allows them.

### Profile presentation

```text
Name
Role and company
Location
Short professional bio
Expertise tags
Published work or contributor status
Connect action
```

Use initials or neutral placeholders for profiles without photos. Do not use fake celebrity portraits or generic stock headshots.

## 9. Onboarding And Activation

Onboarding should take about three minutes and produce a useful profile, not feel like a survey.

Recommended screens:

1. Role: student, industry professional, manager, researcher, clinician, founder, investor, or other.
2. Matching consent: plain-language opt-in, separate from Terms of Service.
3. Topics: choose three to five areas of interest.
4. Goal: learn, find collaborators, find vendors, find mentors, recruit, or stay informed.
5. Notifications: explain the monthly match drop and article updates before asking for preferences.
6. Profile summary: review, edit, and enter the product.

### Activation definition

An account is activated when the user has:

- selected a role;
- selected at least three topics;
- selected one goal;
- made an explicit matching-consent choice;
- reached the Magazine or reviewed a first suggested contact.

Show a small progress indicator, preserve input if the user goes back, and make every step keyboard accessible. The user must be able to use the Magazine without opting into matching.

## 10. Brandkit Application Without Copying

Use the kit for consistency, not imitation. Keep the product’s own logo and naming separate from the reference assets in `ilearn-cri-brand-kit`.

### Adopt

- Fraunces for editorial display and article titles.
- Geist for body copy, navigation, forms, and product UI.
- Geist Mono for categories, tags, dates, bylines, and match explanations.
- Deep Teal `#0D3B4A` as the principal brand color.
- Warm Coral `#D0603D` as a selective accent.
- Paper `#FAF7F2`, Ink `#1A1D1F`, Surface `#F2EFE9`, Border `#E8E4DE`, Muted `#6B7073`.
- Restrained editorial spacing, square-to-soft corners, and quiet motion.

### Make it original

- Create an original logo and editorial mark for this product.
- Use a distinct image direction: laboratories, manufacturing, devices, research teams, documents, and real working environments.
- Build a signature issue-cover system with its own grid, labels, and composition.
- Let the product’s information architecture and match explanations create differentiation.
- Use coral for moments of emphasis, not as repeated decoration.

### Do not copy

- iLearn CRI logos, glyphs, lockups, icons, exact illustrations, screenshots, or copy.
- Their brand page structure one-for-one.
- Their exact proportions, hero composition, or asset naming as a visual template.
- Any third-party logo from the kit as if it represents this product.

## 11. Design System Foundation

Create one token layer and make components consume it. Avoid random hex colors inside JSX.

### Typography

```text
Display XL: clamp(3rem, 7vw, 5.5rem) / 0.95 Fraunces
Display L:  clamp(2.5rem, 5vw, 4.5rem) / 1.0 Fraunces
H1:         clamp(2.25rem, 4vw, 3.5rem) / 1.05 Fraunces
H2:         clamp(1.75rem, 3vw, 2.5rem) / 1.1 Fraunces
H3:         1.5rem / 1.2 Fraunces
Body:       1rem / 1.65 Geist
Body large: 1.125rem / 1.6 Geist
Meta:       0.75rem / 1.4 Geist Mono
```

Do not use viewport-scaled type without a clamp and never use negative letter spacing.

### Layout and interaction tokens

```text
Container:  min(1200px, calc(100% - 2 * 24px))
Article:    min(740px, 100%)
Spacing:    4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128px
Radius:     4, 6, 8px; 12px only for a genuinely framed tool
UI motion:  150-200ms
Card motion: 250-350ms
```

Required primitives:

```text
Logo, Header, MobileNav, Button, Tag, Badge, ArticleCard, IssueHeader,
AuthorByline, MatchCard, ProfileCard, SearchInput, FilterBar, Drawer,
Modal, EmptyState, LoadingState, Footer
```

Buttons need familiar icons where useful, visible focus states, disabled states, and labels that describe the action. Use Lucide or the project’s existing icon source instead of hand-drawn SVG icons for controls.

## 12. Responsive Strategy

Design at four intentional widths:

```text
Mobile:  320-767px
Tablet:  768-1023px
Desktop: 1024-1439px
Wide:    1440px+
```

Mobile is not a collapsed desktop layout. Define separately:

- header and navigation behavior;
- issue-cover proportions;
- article grid order;
- filter overflow and search layout;
- profile drawer behavior;
- match-card actions;
- reading width and sticky elements.

Test the longest realistic headline, largest tag set, empty states, and error messages at every breakpoint. Nothing should overlap, clip, or cause controls to shift size.

## 13. Accessibility, Trust, And Legal UX

- Use semantic headings in page order.
- Provide keyboard access to menus, drawers, filters, tabs, and modals.
- Add visible focus rings and sufficient color contrast.
- Announce dynamic feedback such as connected or dismissed states.
- Respect reduced-motion preferences.
- Do not make consent look like a preselected or buried preference.
- Separate Terms acceptance, privacy consent, and matching opt-in.
- Include a clear route to withdraw matching consent and request data deletion later in Settings.
- Include a professional-information disclaimer wherever users could mistake content or matches for medical or clinical advice.

## 14. Frontend Data And State Strategy

Use typed fixture data now with the same shape expected from the API later.

Every major surface needs these states:

```text
loading
success
empty
error
unauthenticated
permission-limited
premium-gated
```

Keep mock data in `src/data` or a dedicated fixture module, not embedded throughout components. Keep API calls in `src/lib`. Keep visual tokens in `src/index.css` or `src/styles/tokens.css`.

Suggested frontend structure:

```text
src/
  components/
    brand/
    layout/
    ui/
    magazine/
    matching/
    contacts/
  pages/
  data/
  lib/
  styles/
```

## 15. SEO And Content Distribution

The public magazine must be indexable from the beginning.

- Use a real route and stable slug for every article.
- Add title, description, canonical URL, Open Graph image, and Twitter/X card metadata.
- Use Article and Breadcrumb structured data where the final framework supports it.
- Make category and issue pages useful landing pages, not thin filters.
- Ensure article previews do not depend on authentication.
- Keep the sign-up prompt after meaningful readable content.

## 16. Measurement Plan

Instrument the frontend around the business journey, not vanity clicks.

Track:

- homepage CTA click-through;
- latest issue open;
- article read depth and completion;
- signup start and completion;
- onboarding completion by step;
- matching-consent opt-in rate;
- first contact profile opened;
- connect versus not-relevant feedback;
- return visit to the next issue;
- upgrade or company inquiry click.

The first product questions are: do people finish onboarding, do they read, and do they understand why a match was suggested?

## 17. Delivery Phases

### Phase 0: Audit and content preparation

- Confirm product name, logo direction, voice, and primary CTA.
- Inventory existing components and remove unsupported claims.
- Prepare six to ten realistic article fixtures and eight to twelve realistic profiles.
- Define the issue-cover and image treatment.

### Phase 1: Foundation

- Add local Fraunces, Geist, and Geist Mono fonts from the kit’s font files.
- Replace current off-brand tokens and inline color values.
- Create Logo, Button, Tag, Badge, Header, Footer, Card, Drawer, and state primitives.
- Add metadata and favicon wiring for the product’s own assets.

### Phase 2: Public acquisition

- Rebuild the homepage around the editorial-first hierarchy.
- Add Magazine index, issue view, article view, About, Professionals, and Companies pages.
- Add responsive navigation and real content fixtures.

### Phase 3: Activation

- Reorder onboarding around role, explicit consent, interests, goal, notification, and review.
- Preserve state, validate inputs, and add every loading/error/empty state.
- Add the first-session handoff to Magazine.

### Phase 4: Product value

- Rebuild Dashboard shell with three tabs.
- Complete Magazine reading experience.
- Complete explainable Matches experience.
- Complete searchable Contacts directory and profile drawer.

### Phase 5: Conversion and quality

- Add premium gates and company inquiry paths without building payment logic in the frontend.
- Add analytics events, SEO metadata, accessibility pass, performance pass, and responsive QA.
- Replace every placeholder asset or claim that remains.

## 18. Explicit Frontend Out Of Scope

Do not let these delay the frontend validation cycle:

- native mobile apps;
- real-time messaging;
- ML or embedding-based matching;
- enterprise administration dashboard;
- full payment integration;
- email delivery infrastructure;
- CMS administration;
- complex social feed;
- public user-generated comments;
- a separate “AI” product area.

The frontend can represent future states with honest placeholders, but it should not imply that these capabilities already exist.

## 19. Definition Of Done

The frontend is ready for an MVP review when:

- a first-time visitor understands the product and its three verticals in under ten seconds;
- the homepage has one clear primary conversion and a visible latest issue;
- an article can be discovered, opened, read, and shared without signing in;
- onboarding creates a meaningful profile and treats matching consent separately;
- Magazine, Matches, and Contacts each have complete success, loading, empty, error, and gated states;
- match explanations are human-readable and never use fake scores;
- the layout works at mobile, tablet, desktop, and wide desktop sizes;
- keyboard navigation and focus states work across all interactive surfaces;
- the visual system uses the brand kit’s typography and palette as adapted tokens, without using reference-brand logos;
- the build passes and no placeholder claims, broken links, clipped text, or console errors remain.

## Immediate Build Order

1. Confirm the product name and create its original logo treatment.
2. Create the token layer and local font wiring.
3. Refactor existing components to consume tokens.
4. Rebuild the homepage and Magazine first.
5. Rework onboarding and consent.
6. Rebuild Matches and Contacts around their complete state models.
7. Add SEO, analytics, accessibility, and responsive QA.

This order protects the business thesis: prove that the publication is worth returning to, then make the network feel like a valuable extension of it.

