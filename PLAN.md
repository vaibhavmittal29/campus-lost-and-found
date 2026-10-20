# Campus Lost & Found — Frontend Implementation Plan

> **Context:** Mozilla Firefox Club, VIT Vellore — Recruitment, **Frontend** subdomain
> **Project:** Responsive campus lost-and-found interface (post, search, filter, claim)
> **Builder level:** First-year CSE student. Code must be simple, readable, and explainable line by line in an interview.
> **Tool:** Antigravity (agent-driven IDE). Save this file in the repo root as `PLAN.md`.

---

## 0. How to Use This Document with Antigravity

### 0.1 Master prompt (paste this first)

```text
Read PLAN.md completely before writing any code.

You are helping me build the "Campus Lost & Found" frontend for my Mozilla Firefox
Club (VIT Vellore) recruitment, Frontend subdomain. I am a first-year student and
I must be able to explain every file in an interview.

Rules:
1. Work on ONE phase at a time, in order, starting with Phase 0.
2. At the end of each phase: run `npm run lint` and `npm run build`, open the app
   in the browser and check it at 375px, 768px and 1280px widths, then give me:
   (a) a list of files created/changed, (b) each acceptance criterion marked
   pass/fail, (c) one short paragraph explaining how the new code works in
   plain language. Then STOP and wait for me to say "next phase".
3. Only use the dependencies listed in Section 3. Ask me before adding anything else.
4. No backend, no authentication, no database. Data is local mock JSON + localStorage.
5. Keep components small (under ~150 lines), use clear names, and add short
   comments only where the logic is not obvious.
6. Never leave console errors or warnings. Never hotlink external images.
7. Use plain CSS with CSS variables (no Tailwind, no UI kit), as described in Section 9.
8. Do not modify files unrelated to the current phase.
9. Commit after each phase using the commit message given in the phase.
```

### 0.2 Per-phase workflow

1. Paste: `Start Phase N from PLAN.md.` (the phase section has its own prompt too).
2. Let the agent finish, then **read the diff yourself** — do not merge what you cannot explain.
3. Run the app in **Firefox** (this is a Mozilla club — use Firefox as your primary browser and its Responsive Design Mode, `Ctrl+Shift+M`) and also quickly in Chrome.
4. Tick the acceptance checkboxes. Fix anything failing before moving on.
5. Commit. Move to the next phase.

### 0.3 Understand-before-you-ship rule

After every phase, ask Antigravity: *"Explain the data flow of what you just built as if I were explaining it to a senior in an interview."* Write 2–3 lines of notes in your own words (these feed Section 15, Viva Prep).

---

## 1. Project Summary

**Goal:** A single-page, responsive web app where students can browse lost/found items on campus, search and filter them, post a new lost/found item with an image, and claim an item.

**Non-goals (do not build):** login/signup, real backend, real maps, payments, chat, notifications, admin panel.

**What evaluators will likely look at:**

- Does everything in the Base Requirements work without bugs?
- Is the UI clean, consistent, and truly responsive (not just "shrinks")?
- Are loading / empty / error states handled?
- Is the code organised, readable, and is the README clear?
- Brownie points: debounce, sorting, image preview, skeletons, validation, polish.
- Can you explain your own code?

---

## 2. Requirement Traceability Matrix

| # | Requirement | Type | Delivered in | Where it lives |
|---|---|---|---|---|
| R1 | Item cards: image, name, category, location, date, status | Base | Phase 3 | `ItemCard`, `ItemGrid` |
| R2 | Search | Base | Phase 4 | `SearchBar`, `filterItems.js` |
| R3 | Filter by category / location / status | Base | Phase 4 | `FilterPanel`, `filterItems.js` |
| R4 | Post lost/found form | Base | Phase 6 | `PostItemDialog`, `PostItemForm` |
| R5 | Claim items | Base (title) | Phase 7 | `ItemDetailDialog`, `ClaimForm` |
| R6 | Local/mock JSON or simple API, no auth | Base | Phase 2 | `public/data/items.json`, `itemsApi.js` |
| B1 | Debounced search | Brownie | Phase 4 | `useDebouncedValue` |
| B2 | Sort: newest, oldest, nearest/most relevant | Brownie | Phase 5 | `sortItems.js`, `SortSelect` |
| B3 | Image preview before submission | Brownie | Phase 6 | `ImageUploader` |
| B4 | Skeleton loading | Brownie | Phase 3 | `ItemCardSkeleton` |
| B5 | Empty states | Brownie | Phase 3 / 8 | `EmptyState` |
| B6 | Useful form validation | Brownie | Phase 6 | `validators.js`, `FormField` |
| B7 | Responsive mobile + desktop | Brownie | Phases 1, 9 | CSS + `FilterPanel` drawer |
| D1 | Source code / Git repo | Deliverable | Phase 0 → 12 | GitHub |
| D2 | Short README with component structure | Deliverable | Phase 12 | `README.md` |

---

## 3. Tech Stack & Decisions

| Choice | Decision | Reason |
|---|---|---|
| Framework | **React 18+ with Vite** (JavaScript, JSX) | Fast setup, easy to explain, what most frontend clubs expect |
| Styling | **Plain CSS + CSS variables** (one CSS file per component) | Shows real CSS skill (Grid, Flexbox, custom properties, media queries); zero config |
| Routing | **None** (single page; dialogs for post/detail) | Not needed; keeps scope small |
| State | `useState`, `useReducer`, custom hooks, `useMemo` | No Redux/Zustand — overkill |
| Data | `public/data/items.json` + `localStorage` for new posts/claims, accessed through a mock API module with simulated latency | Satisfies "local/mock JSON" and makes skeletons demonstrable |
| Icons | `lucide-react` | Small, consistent, accessible |
| Modals | Native `<dialog>` element | Built-in focus handling, Esc to close, supported in Firefox |
| Lint | ESLint (Vite default) | Clean code |
| Tests (optional) | Vitest for pure utility functions | Cheap way to show quality |

**Allowed dependencies:** `react`, `react-dom`, `lucide-react`. Dev: `vite`, `@vitejs/plugin-react`, `eslint` + plugins from the Vite template, and (optionally) `vitest`.

**Browser support target:** latest Firefox (primary), latest Chrome, Safari/Edge best effort.

---

## 4. Data Model

### 4.1 Item

```json
{
  "id": "itm_001",
  "title": "Blue Hydro Flask Bottle",
  "category": "Bottles & Lunch Boxes",
  "locationId": "tt",
  "date": "2026-10-17",
  "postedAt": "2026-10-17T09:30:00.000Z",
  "status": "found",
  "description": "Blue 750ml steel bottle with a dent near the base and a small VIT sticker.",
  "image": "/images/placeholders/bottle.svg",
  "contact": "finder@vitstudent.ac.in",
  "claim": null
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | `itm_###` for seed data; `itm_` + `Date.now()` for user posts |
| `title` | string | 3–60 chars |
| `category` | string | One of the categories in 4.2 |
| `locationId` | string | One of the ids in 4.3 (card shows the label) |
| `date` | `YYYY-MM-DD` | Date the item was lost/found. Not in the future |
| `postedAt` | ISO datetime | Used for newest/oldest sorting |
| `status` | `"lost"` \| `"found"` \| `"claimed"` | Starts as `lost` or `found`; becomes `claimed` after a claim |
| `description` | string | 10–300 chars |
| `image` | string \| null | Path, or a resized data-URL for user uploads. `null` → category placeholder |
| `contact` | string | Email or 10-digit phone of the poster |
| `claim` | object \| null | `{ name, contact, message, claimedAt, previousStatus }` |

### 4.2 Categories (constants)

`Electronics`, `ID & Cards`, `Wallets & Bags`, `Keys`, `Books & Stationery`, `Clothing & Accessories`, `Bottles & Lunch Boxes`, `Other`

Each category has an icon (lucide) and an accent colour token used for the badge and the placeholder image.

### 4.3 Mock campus locations (constants)

Each location has a label and mock `x, y` coordinates on a 0–100 grid (not real GPS). Used only for the "Nearest" sort. **Rename these to real VIT Vellore places you know** — the coordinates are arbitrary but should roughly make sense relative to each other.

| id | label | x | y |
|---|---|---|---|
| `tt` | Technology Tower (TT) | 50 | 50 |
| `sjt` | Silver Jubilee Tower (SJT) | 58 | 46 |
| `mb` | Main Building | 42 | 55 |
| `lib` | Central Library | 46 | 40 |
| `anna` | Anna Auditorium | 35 | 48 |
| `foodys` | Foodys / Food Court | 62 | 58 |
| `gdn` | Gandhi Block | 54 | 62 |
| `mh` | Men's Hostel Area | 80 | 30 |
| `lh` | Ladies' Hostel Area | 20 | 25 |
| `sports` | Sports Complex | 75 | 78 |
| `gate` | Main Gate | 12 | 85 |
| `other` | Somewhere else on campus | 50 | 50 |

### 4.4 Seed data requirements (`public/data/items.json`)

- **24 items** minimum, spread across **all categories, all locations, and all three statuses** (about 10 lost, 10 found, 4 claimed).
- Make 2–3 titles deliberately similar ("Black wallet", "Black leather wallet") so search relevance is visible.
- Make 1 item with a very long title and 1 with a very long description to test card truncation.
- Make 2 items with `image: null` to test the placeholder fallback.
- Seed dates must **not go stale**: store `daysAgo` (number) in the JSON instead of `date`/`postedAt`, and let the mock API convert it to real dates at load time (see 5.2).
- Realistic, friendly, non-sensitive text. No real names, phone numbers, or registration numbers. Use fake contacts like `student1@example.com`.

---

## 5. Mock API & Persistence Design

### 5.1 Module: `src/api/itemsApi.js`

All data access goes through this file so components never touch `fetch` or `localStorage` directly. This makes it easy to swap in a real backend later (mention this in the README).

| Function | Behaviour |
|---|---|
| `fetchItems()` | Waits 600–900 ms (simulated latency) → loads seed JSON → merges with user posts and claim overrides from `localStorage` → returns array |
| `createItem(payload)` | Waits ~500 ms → builds a full item (id, postedAt, status = `payload.type`) → saves to `localStorage` → returns the item |
| `claimItem(id, claimPayload)` | Waits ~500 ms → marks item `claimed`, stores `claim` object → saves override → returns updated item |
| `resetDemoData()` | Clears the app's `localStorage` keys |

### 5.2 Seed conversion

On load, each seed item with `daysAgo` gets: `date = today − daysAgo` (as `YYYY-MM-DD`), `postedAt = same day at a fixed time`.

### 5.3 Storage keys (versioned)

- `clf:v1:userItems` → array of items posted by the user
- `clf:v1:claims` → map `{ [itemId]: claimObject }`

Wrap every `localStorage` call in `try/catch` (storage can be full or blocked). On failure, keep working in memory and show a toast.

### 5.4 Failure simulation (for testing the error state)

If the URL contains `?fail=1`, `fetchItems()` rejects with an error. This lets you demo and test the error state with a Retry button.

### 5.5 Fetch path warning

Always fetch with `` `${import.meta.env.BASE_URL}data/items.json` `` — never a hard-coded `/data/items.json`. A hard-coded path breaks on GitHub Pages sub-paths.

---

## 6. Folder Structure

```text
campus-lost-found/
├── public/
│   ├── data/
│   │   └── items.json
│   ├── images/
│   │   └── placeholders/          # one SVG per category + generic fallback
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── itemsApi.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx / .css
│   │   │   ├── Footer.jsx / .css
│   │   │   └── PageContainer.jsx / .css
│   │   ├── items/
│   │   │   ├── ItemCard.jsx / .css
│   │   │   ├── ItemGrid.jsx / .css
│   │   │   ├── ItemCardSkeleton.jsx / .css
│   │   │   ├── ItemDetailDialog.jsx / .css
│   │   │   └── ClaimForm.jsx / .css
│   │   ├── filters/
│   │   │   ├── SearchBar.jsx / .css
│   │   │   ├── FilterPanel.jsx / .css
│   │   │   ├── SortSelect.jsx / .css
│   │   │   ├── ResultsSummary.jsx / .css      # "12 items found" + active chips
│   │   │   └── ActiveFilterChips.jsx / .css
│   │   ├── post/
│   │   │   ├── PostItemDialog.jsx / .css
│   │   │   ├── PostItemForm.jsx / .css
│   │   │   └── ImageUploader.jsx / .css
│   │   └── ui/
│   │       ├── Button.jsx / .css
│   │       ├── Badge.jsx / .css               # status + category badges
│   │       ├── Dialog.jsx / .css              # wrapper around <dialog>
│   │       ├── FormField.jsx / .css           # label + input + error + hint
│   │       ├── EmptyState.jsx / .css
│   │       ├── ErrorState.jsx / .css
│   │       ├── Toast.jsx / .css               # + ToastProvider
│   │       └── ItemImage.jsx                  # <img> with fallback + lazy load
│   ├── constants/
│   │   ├── categories.js
│   │   ├── locations.js
│   │   ├── statuses.js
│   │   └── sortOptions.js
│   ├── hooks/
│   │   ├── useItems.js
│   │   ├── useFilters.js                      # state + URL sync
│   │   ├── useDebouncedValue.js
│   │   ├── useMediaQuery.js
│   │   └── useToast.js
│   ├── utils/
│   │   ├── filterItems.js
│   │   ├── sortItems.js
│   │   ├── relevance.js                       # scoring for "best match"
│   │   ├── distance.js
│   │   ├── validators.js
│   │   ├── formatDate.js
│   │   └── imageUtils.js                      # validate, resize, to data-URL
│   ├── styles/
│   │   ├── tokens.css                         # CSS variables
│   │   ├── base.css                           # reset + typography
│   │   └── utilities.css                      # .visually-hidden, .container, etc.
│   ├── App.jsx
│   └── main.jsx
├── tests/                                     # optional Vitest tests
├── PLAN.md
├── README.md
├── index.html
├── package.json
└── vite.config.js
```

---

## 7. Component Architecture

### 7.1 Tree

```text
<App>
 ├─ <ToastProvider>
 │   ├─ <Header>                      (logo, title, "Post an item" button)
 │   ├─ <main>
 │   │   ├─ <SearchBar />             (debounced)
 │   │   ├─ <div class="layout">
 │   │   │   ├─ <FilterPanel />       (sidebar on desktop, drawer on mobile)
 │   │   │   └─ <section class="results">
 │   │   │        ├─ <ResultsSummary />   (count + SortSelect + ActiveFilterChips)
 │   │   │        ├─ loading → <ItemGrid><ItemCardSkeleton ×8 /></ItemGrid>
 │   │   │        ├─ error   → <ErrorState onRetry />
 │   │   │        ├─ empty   → <EmptyState variant="no-results" | "no-items" />
 │   │   │        └─ ready   → <ItemGrid><ItemCard ×N /></ItemGrid>
 │   │   └─ <FloatingPostButton />    (mobile only)
 │   ├─ <Footer />                    ("Reset demo data")
 │   ├─ <PostItemDialog>              → <PostItemForm> → <ImageUploader>, <FormField>
 │   └─ <ItemDetailDialog>            → <ClaimForm>
```

### 7.2 Key components and props

| Component | Props | Responsibility |
|---|---|---|
| `ItemCard` | `item`, `onOpen(item)` | Presentational card. Image, title, category badge, location, date, status badge. Whole card is a button/link target that opens the detail dialog |
| `ItemGrid` | `children` | Responsive CSS Grid wrapper |
| `ItemCardSkeleton` | none | Same dimensions as `ItemCard` to prevent layout shift |
| `SearchBar` | `value`, `onChange`, `onClear` | Controlled input; the debounce happens in the parent/hook |
| `FilterPanel` | `filters`, `onChange`, `onReset`, `counts` | Status segmented control, category chips, location select, reset button |
| `SortSelect` | `value`, `onChange`, `hasQuery`, `referenceLocation`, `onReferenceChange` | Sort dropdown; shows a location picker when "Nearest" is selected |
| `ActiveFilterChips` | `filters`, `onRemove` | Removable chips for each active filter |
| `PostItemDialog` | `open`, `onClose`, `onCreated` | Wraps the form in a `Dialog` |
| `PostItemForm` | `onSubmit`, `onCancel` | Fields, validation, submit state |
| `ImageUploader` | `file`, `onChange`, `error` | Pick/drag-drop, preview, remove, size/type validation |
| `ItemDetailDialog` | `item`, `onClose`, `onClaimed` | Large image, full details, claim button/form |
| `ClaimForm` | `item`, `onSubmit`, `onCancel` | Name, contact, proof message |
| `Dialog` | `open`, `onClose`, `title`, `children` | Controls `<dialog>` `showModal()` / `close()`, backdrop click, focus return |
| `FormField` | `id`, `label`, `error`, `hint`, `required`, `children` | Consistent label/error/aria wiring |
| `Badge` | `variant` (`lost`/`found`/`claimed`/`category`), `children` | Status colour + icon + text (never colour alone) |
| `EmptyState` | `variant`, `onAction` | Illustration/icon + message + action |
| `ErrorState` | `message`, `onRetry` | Friendly error + Retry |
| `ItemImage` | `src`, `alt`, `category` | `<img loading="lazy">` with `onError` fallback to the category placeholder |

---

## 8. State Management & Data Flow

```text
useItems()            → { items, status: 'loading'|'error'|'ready', error, reload, addItem, claim }
useFilters()          → { filters, setFilter, resetFilters }          (synced to URL)
useDebouncedValue()   → debouncedQuery from the raw input text
useMemo(() => sortItems(filterItems(items, filters), sort, ref))   → visibleItems
```

### 8.1 Filters object

```js
{
  q: '',                // search text (debounced before it is applied)
  category: 'all',      // 'all' | category name
  location: 'all',      // 'all' | location id
  status: 'all',        // 'all' | 'lost' | 'found' | 'claimed'
  sort: 'newest',       // 'newest' | 'oldest' | 'nearest' | 'relevance'
  ref: 'tt'             // reference location id for "nearest"
}
```

### 8.2 Rules

- The **search input is controlled by raw text**; the **filtering uses the debounced value** (300 ms).
- Filtering and sorting are **pure functions** in `utils/` — no React inside — so they are easy to test.
- Derived data (`visibleItems`, counts) is computed with `useMemo`, never stored in state.
- **URL sync:** `?q=wallet&category=Keys&location=tt&status=found&sort=newest`. Read once on load, update with `history.replaceState` when filters change (omit default values to keep URLs clean). This makes filtered views shareable.
- Dialogs: `selectedItem` (detail) and `isPostOpen` (post form) live in `App`.
- After `createItem`, prepend the new item to state, scroll to top, flash a highlight on the new card for 2 s, and show a success toast.

---

## 9. Design System (build in Phase 1)

### 9.1 Principles

Clean, friendly, high-contrast, content-first. Card images do the visual work; UI chrome stays quiet. A subtle nod to Firefox/Mozilla colours (warm orange accent) is nice but optional — **do not use Mozilla logos or trademarked assets.**

### 9.2 Tokens (`tokens.css`)

```css
:root {
  /* Colour */
  --color-bg: #f7f7fa;
  --color-surface: #ffffff;
  --color-text: #1f1f2e;
  --color-text-muted: #5c5c70;
  --color-border: #e1e1ea;
  --color-primary: #e65a00;          /* warm orange accent — verify contrast */
  --color-primary-hover: #c44d00;
  --color-focus: #2b5fff;

  --color-lost-bg: #fde8e8;   --color-lost-fg: #9b1c1c;
  --color-found-bg: #e3f6ea;  --color-found-fg: #14532d;
  --color-claimed-bg: #e8e8ef; --color-claimed-fg: #3f3f55;

  /* Spacing scale */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px;

  /* Radius & shadow */
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px; --radius-pill: 999px;
  --shadow-card: 0 1px 3px rgba(20, 20, 40, .08), 0 4px 12px rgba(20, 20, 40, .06);
  --shadow-hover: 0 6px 20px rgba(20, 20, 40, .14);

  /* Type */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --text-sm: .875rem; --text-md: 1rem; --text-lg: 1.25rem; --text-xl: 1.75rem;

  /* Layout */
  --container-max: 1280px;
  --header-height: 64px;
}
```

Dark mode is a **stretch goal** (see Section 17). If done, override tokens inside `@media (prefers-color-scheme: dark)`.

### 9.3 Breakpoints (mobile-first, `min-width`)

| Name | Width | Layout |
|---|---|---|
| Mobile | default (≥320px) | 1 column cards, filters in a bottom drawer, floating "+" button, full-screen dialogs |
| Tablet | ≥ 640px | 2 columns, filters still in drawer, centred dialogs |
| Laptop | ≥ 1024px | Sidebar filters (260px) + 3 columns, inline "Post an item" button |
| Desktop | ≥ 1280px | Sidebar + 4 columns (container capped at 1280px) |

Use `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))` for the card grid so it adapts without many breakpoints.

### 9.4 Card anatomy

```text
┌───────────────────────────┐
│ [   image 4:3   ]  [STATUS]│  ← status badge overlays the image corner
├───────────────────────────┤
│ Item name (max 2 lines)    │
│ [icon] Category            │
│ 📍 Location                │
│ 🗓 12 Oct 2026 · 3 days ago │
└───────────────────────────┘
```

- Image: `aspect-ratio: 4 / 3; object-fit: cover`, rounded top.
- Hover (desktop): lift + shadow. Focus-visible: 3px outline in `--color-focus`.
- Claimed cards: slightly desaturated image + "Claimed" badge.

### 9.5 Motion

Subtle only: 150–200 ms transitions. Wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`.

---

## 10. Implementation Phases

> **Estimated total:** 8–10 focused days for a beginner (see Section 18 for a schedule). Every phase ends with a working, committed app.

---

### Phase 0 — Project Setup & Repository

**Goal:** Empty-but-running project on GitHub with a clean baseline.

**Tasks**
- [ ] Scaffold: `npm create vite@latest campus-lost-found -- --template react` and `cd` into it, `npm install`.
- [ ] Install: `npm install lucide-react`.
- [ ] Remove the Vite demo content (default `App.css`, logos, counter code).
- [ ] Create the folder structure from Section 6 (empty folders with placeholder files are fine).
- [ ] Add `PLAN.md` to the repo root.
- [ ] Set the page `<title>` ("Campus Lost & Found"), `<meta name="description">`, `<meta name="viewport">`, `lang="en"`, and an SVG favicon.
- [ ] Add a clear `.gitignore` (node_modules, dist, .env, OS files).
- [ ] `git init`, create a GitHub repo (public), push the first commit.
- [ ] Add npm scripts: `dev`, `build`, `preview`, `lint`.

**Acceptance criteria**
- `npm run dev` shows a blank page with the correct title and no console errors.
- `npm run build` and `npm run lint` both pass.
- Repo is on GitHub with `PLAN.md` visible.

**Antigravity prompt**
```text
Start Phase 0 from PLAN.md. Scaffold the Vite React project, strip the demo code,
create the folder structure in Section 6, set up index.html metadata, and prepare
the first commit. Do not build any UI yet.
```

**Commit:** `chore: scaffold Vite React project and folder structure`

---

### Phase 1 — Design Tokens, Base Styles & Layout Shell

**Goal:** The empty page already looks like a real product and is responsive.

**Tasks**
- [ ] `styles/tokens.css` with the variables from 9.2; import all style files in `main.jsx`.
- [ ] `styles/base.css`: modern reset (`box-sizing: border-box`, margin reset), body font/colour/background, `img { max-width: 100%; display: block }`, visible `:focus-visible` outline, `button`/`input` inherit font.
- [ ] `styles/utilities.css`: `.visually-hidden`, `.container` (max-width + horizontal padding), `.stack` helpers if useful.
- [ ] `Header`: logo mark (simple SVG) + "Campus Lost & Found" + subtitle "Reunite campus belongings", and a primary "Post an item" button (button can be non-functional yet).
- [ ] `PageContainer`, `Footer` (small text, "Built for Mozilla Firefox Club VIT Vellore recruitment").
- [ ] `App` layout skeleton: header → main with two regions (`aside.filters`, `section.results`) → footer. Use CSS Grid: single column on mobile, `260px 1fr` from 1024px.
- [ ] Reusable `Button` (variants: primary, secondary, ghost; sizes: md, sm; `disabled`/`loading` state).
- [ ] Add a **skip link** ("Skip to results") as the first focusable element.

**Acceptance criteria**
- Header is sticky, readable at 320px, and does not overflow horizontally at any width.
- Tab key shows a visible focus ring on every interactive element; the skip link works.
- No hard-coded colours in component CSS — only tokens.

**Antigravity prompt**
```text
Start Phase 1 from PLAN.md. Implement tokens.css, base.css, utilities.css, Header,
Footer, PageContainer, Button and the App layout shell (placeholder regions for
filters and results). Mobile-first CSS using the breakpoints in Section 9.3.
```

**Commit:** `feat(ui): add design tokens, base styles, header/footer and layout shell`

---

### Phase 2 — Data Layer (Mock JSON + API Module + Hooks)

**Goal:** Data flows from JSON into React state with realistic loading behaviour.

**Tasks**
- [ ] `constants/categories.js`, `locations.js`, `statuses.js`, `sortOptions.js` as in Section 4 (export arrays **and** lookup helpers like `getLocation(id)`).
- [ ] Create `public/data/items.json` per 4.4 (24 items, uses `daysAgo`).
- [ ] Create SVG placeholders in `public/images/placeholders/` — one per category plus `generic.svg`. Simple, flat, colour-matched to category tokens. No external images.
- [ ] `utils/formatDate.js`: `formatDate(iso)` → `"12 Oct 2026"` using `Intl.DateTimeFormat('en-IN', …)`; `timeAgo(iso)` → `"3 days ago"` using `Intl.RelativeTimeFormat`.
- [ ] `api/itemsApi.js` exactly as Section 5 (latency, merge with localStorage, `?fail=1`).
- [ ] `hooks/useItems.js` returning `{ items, status, error, reload, addItem, claim }`; handles loading → ready/error; guards against state updates after unmount.
- [ ] Temporarily render a plain `<pre>` list of item titles in `App` to prove the data works (remove in Phase 3).

**Acceptance criteria**
- Refreshing the page shows a short loading period, then the data.
- `?fail=1` produces an error status in the hook.
- Dates in the data are always recent relative to today (not hard-coded).
- localStorage failure (simulate by wrapping in try/catch test) does not crash the app.

**Antigravity prompt**
```text
Start Phase 2 from PLAN.md. Create the constants, seed JSON (24 items with daysAgo),
SVG placeholders, formatDate utils, itemsApi.js with simulated latency and the
?fail=1 switch, and the useItems hook. Show a temporary list of titles to verify.
```

**Commit:** `feat(data): add mock items JSON, API module and useItems hook`

---

### Phase 3 — Item Cards, Grid, Skeleton & Basic States  *(Requirement R1, Brownie B4/B5)*

**Goal:** The main browsing experience: cards in a responsive grid with loading skeletons.

**Tasks**
- [ ] `ItemImage`: `<img loading="lazy" decoding="async">` with explicit `aspect-ratio`; on `onError`, swap to the category placeholder; meaningful `alt` (e.g., `"Photo of Blue Hydro Flask Bottle"`); when `image` is `null`, use the placeholder directly.
- [ ] `Badge` with three status variants, each with **icon + text + colour** (lost: search icon, found: check icon, claimed: handshake/lock icon). Category badge uses the category icon.
- [ ] `ItemCard` per 9.4: image, title (2-line clamp), category, location label, formatted date + relative time, status badge. Whole card is one `<button>` (or an `<article>` containing one stretched button) → calls `onOpen(item)`.
- [ ] `ItemGrid` with `repeat(auto-fill, minmax(240px, 1fr))`.
- [ ] `ItemCardSkeleton`: same size as a card; shimmer animation that is disabled under `prefers-reduced-motion`. Render 8 while loading.
- [ ] `EmptyState` (variants `no-items`, `no-results`) and `ErrorState` (with Retry calling `reload`).
- [ ] Wire everything in `App` using the status from `useItems`; remove the temporary `<pre>`.
- [ ] Truncate long titles/descriptions gracefully (no overflow, no layout break).

**Acceptance criteria**
- On load, 8 skeleton cards show, then real cards replace them without layout jump.
- Cards show all 6 required elements. Items with missing/broken images show the placeholder.
- Long text never breaks the layout. Grid is 1/2/3/4 columns at the breakpoints in 9.3.
- `?fail=1` shows the error state; Retry works.
- Cards are keyboard-focusable and open nothing yet (a `console.log`-free no-op is fine).

**Antigravity prompt**
```text
Start Phase 3 from PLAN.md. Build ItemImage, Badge, ItemCard, ItemGrid,
ItemCardSkeleton, EmptyState and ErrorState, and wire loading/error/ready states
in App. Match the card anatomy in Section 9.4.
```

**Commit:** `feat(items): add item cards, responsive grid, skeleton loading and base states`

---

### Phase 4 — Search & Filters  *(R2, R3, Brownie B1)*

**Goal:** Users can narrow the list instantly with debounced search and three filters.

**Tasks**
- [ ] `hooks/useDebouncedValue.js`: `useDebouncedValue(value, delay = 300)` with proper `setTimeout` cleanup in `useEffect`.
- [ ] `hooks/useFilters.js`: filters state per 8.1 + `setFilter(key, value)` + `resetFilters()`; initial state read from URL; `history.replaceState` on change; omit defaults from the URL.
- [ ] `utils/filterItems.js` — **pure function** `filterItems(items, { q, category, location, status })`:
  - Case-insensitive; trims input; splits `q` into words — **every word must match** (AND logic) in title, description, category label or location label.
  - Category/location/status filters are exact matches unless `'all'`.
- [ ] `SearchBar`: controlled input with search icon, clear (×) button, `type="search"`, `aria-label`, and placeholder "Search by item, place or category…". Pressing Esc clears.
- [ ] `FilterPanel`:
  - Status: segmented control (All / Lost / Found / Claimed) using radio inputs styled as buttons.
  - Category: chips (single-select) with icons.
  - Location: `<select>`.
  - "Reset filters" button (disabled when no filters are active).
  - Show per-option counts if easy (stretch within phase).
- [ ] `ResultsSummary`: "Showing **12** of 24 items" inside an `aria-live="polite"` region.
- [ ] `ActiveFilterChips`: each active filter as a removable chip.
- [ ] Connect: raw `searchText` state in `SearchBar`; `debouncedQ = useDebouncedValue(searchText, 300)`; filtering uses `debouncedQ`.
- [ ] "No results" empty state shows the current search/filters and a **"Clear all filters"** action.

**Acceptance criteria**
- Typing "wallet" quickly triggers filtering **once**, ~300 ms after the last keystroke (verify with a temporary `console.log`, then remove it).
- Combining search + category + location + status works and results shrink correctly.
- Reloading the page or sharing the URL restores the exact filter state.
- Clear (×), Esc, chips and Reset all work. Screen reader announces the result count change.
- With zero matches, the empty state appears with a working clear button.

**Antigravity prompt**
```text
Start Phase 4 from PLAN.md. Implement useDebouncedValue, useFilters (URL-synced),
filterItems (pure), SearchBar, FilterPanel, ResultsSummary, ActiveFilterChips and
the no-results empty state. Search must be debounced 300ms.
```

**Commit:** `feat(filters): add debounced search, category/location/status filters and URL sync`

---

### Phase 5 — Sorting  *(Brownie B2)*

**Goal:** Newest, oldest, nearest-location, and best-match sorting.

**Tasks**
- [ ] `utils/distance.js`: `distanceBetween(locationIdA, locationIdB)` → Euclidean distance using the mock grid in 4.3.
- [ ] `utils/relevance.js`: `scoreItem(item, q)` — for each query word: title word-start match **+5**, title contains **+3**, category/location label contains **+2**, description contains **+1**. Items with score 0 are already removed by `filterItems`.
- [ ] `utils/sortItems.js` — pure `sortItems(items, sort, { q, ref })`:
  - `newest`: `postedAt` descending
  - `oldest`: `postedAt` ascending
  - `nearest`: ascending distance from `ref`; ties broken by newest
  - `relevance`: descending score; ties broken by newest
  - Must **not mutate** the input (use `[...items]`).
- [ ] `SortSelect`: dropdown with the four options; **"Best match" is only enabled when there is a search query** (disabled + tooltip/hint otherwise); when `q` becomes non-empty for the first time, auto-switch to Best match (but let the user change it).
- [ ] When "Nearest" is chosen, show a secondary select "I'm near…" (reference location, default Technology Tower); show a small distance hint on cards like "≈ 120 m away" (map grid units → fake metres, e.g. ×4).
- [ ] Persist `sort` and `ref` in URL (already part of filters).

**Acceptance criteria**
- Each sort option reorders the grid correctly (verify with the seed data by eye).
- Changing the reference location re-orders the "Nearest" list.
- "Best match" is unavailable without a query and works with one (exact title matches rank above description-only matches).
- Sorting never mutates the original items array.

**Antigravity prompt**
```text
Start Phase 0 from PLAN.md. Implement distance.js, relevance.js, sortItems.js and
SortSelect, including the reference-location picker for "Nearest" and the rule that
"Best match" requires a search query. Keep sort functions pure and non-mutating.
```

**Commit:** `feat(sort): add newest/oldest/nearest/best-match sorting`

---

### Phase 6 — Post Item Form  *(R4, Brownie B3/B6)*

**Goal:** A friendly, validated form with live image preview that adds a new item to the list.

**Tasks**
- [ ] `ui/Dialog.jsx`: wraps native `<dialog>`; opens with `showModal()`; Esc closes; backdrop click closes; locks body scroll; returns focus to the trigger on close; full-screen on mobile, centred card (max 560px) from 640px.
- [ ] `ui/FormField.jsx`: label, required marker, hint, error message wired with `aria-describedby` and `aria-invalid`.
- [ ] `PostItemForm` fields:

| Field | Control | Rules |
|---|---|---|
| Type | Radio: "I lost something" / "I found something" | Required, default "lost" |
| Item name | Text | Required, 3–60 chars, trimmed |
| Category | Select | Required |
| Location | Select | Required |
| Date | `<input type="date">` | Required, not in the future, not older than 90 days (`max` = today, `min` = today − 90) |
| Description | Textarea | Required, 10–300 chars, live counter "142/300" |
| Photo | File | Optional; JPG/PNG/WebP only; max 5 MB before resizing |
| Contact | Text | Required; valid email **or** 10-digit Indian mobile number |

- [ ] `utils/validators.js`: one small pure function per field returning an error string or `''`, plus `validateForm(values)` returning an errors object. Unit-testable.
- [ ] Validation UX:
  - Validate a field on **blur**, then re-validate on every change once it has been touched.
  - On submit with errors: show an error summary at the top (`role="alert"`) and **focus the first invalid field**.
  - Error messages are specific and kind: "Add at least 10 characters so people can recognise the item" — not "Invalid input".
  - Submit button disabled while submitting; shows a spinner and "Posting…".
- [ ] `utils/imageUtils.js`:
  - `validateImageFile(file)` → type and size checks.
  - `resizeImageToDataUrl(file, maxSize = 800, quality = 0.8)` using `canvas` → JPEG data URL (keeps localStorage small).
- [ ] `ImageUploader`:
  - Click to choose or drag-and-drop zone with keyboard support.
  - **Instant preview** via `URL.createObjectURL(file)`; revoke the URL in cleanup (`useEffect` return) to avoid leaks.
  - "Remove photo" and "Change photo" buttons; show file name and size.
  - Image errors are shown inside the uploader.
- [ ] On valid submit: call `createItem`, close the dialog, prepend the item, scroll to top, highlight the new card for 2 s, success toast ("Your item has been posted").
- [ ] Hook up the header's "Post an item" button and the mobile floating "+" button.
- [ ] Optional but recommended: keep an unsaved draft in `sessionStorage` while the dialog is open; ask before discarding if the form is dirty.

**Acceptance criteria**
- Every validation rule above works, including the date range and contact format.
- Selecting an image shows a preview immediately; removing it clears the preview; a 10 MB PDF is rejected with a clear message.
- Posting adds the item to the grid, and it **survives a page refresh** (localStorage).
- Keyboard-only users can fill and submit the form; screen readers hear field errors.
- No memory leaks from object URLs; no console warnings.

**Antigravity prompt**
```text
Start Phase 6 from PLAN.md. Build Dialog, FormField, validators.js, imageUtils.js,
ImageUploader (with instant preview), PostItemForm and PostItemDialog. Implement the
validation UX described (blur → change, error summary, focus first error) and wire
createItem so new posts appear instantly and persist after refresh.
```

**Commit:** `feat(post): add post-item dialog with validation and image preview`

---

### Phase 7 — Item Detail & Claim Flow  *(R5)*

**Goal:** Users can open any item and claim it.

**Tasks**
- [ ] `ItemDetailDialog`: large image, title, status + category badges, location, formatted date + relative time, full description, posted-by contact **hidden until the claim form is submitted** (see below), and a primary action button.
- [ ] Action button label depends on status:
  - `found` → **"This is mine — claim it"**
  - `lost` → **"I found this item"**
  - `claimed` → disabled button "Already claimed" + claimed date.
- [ ] `ClaimForm` fields: your name (2–50), contact email/phone (same validator as Post), and a message (10–200 chars; for found items the label is "Describe something only the owner would know (colour, marks, contents)").
- [ ] On submit: `claimItem(id, payload)` → status becomes `claimed`, `claim` object stored, card and dialog update, **poster contact is now revealed** with a copy-to-clipboard button, toast "Claim submitted".
- [ ] Add a visible note: "Demo only — no real notification is sent."
- [ ] Support deep link `?item=itm_005` that opens the dialog on load (stretch within phase).
- [ ] Dialog is scrollable on small screens; Esc / backdrop / close button all work.

**Acceptance criteria**
- Clicking or pressing Enter on any card opens its detail dialog.
- Claiming changes the status everywhere (card badge, detail, status filter counts) and persists after refresh.
- A claimed item cannot be claimed again.
- Form validation works the same way as the Post form.
- Focus returns to the card that opened the dialog.

**Antigravity prompt**
```text
Start Phase 7 from PLAN.md. Build ItemDetailDialog and ClaimForm. The action label
depends on status (found / lost / claimed). Submitting calls claimItem, updates the
item to "claimed" everywhere, persists to localStorage, and reveals the poster contact.
```

**Commit:** `feat(claim): add item detail dialog and claim flow`

---

### Phase 8 — Polish: Toasts, Empty/Error States, Micro-interactions

**Goal:** The app feels finished and forgiving.

**Tasks**
- [ ] `Toast` + `ToastProvider` + `useToast()`: success / error / info, auto-dismiss in 4 s, pause on hover, dismiss button, rendered in an `aria-live="polite"` region, stacked bottom-centre on mobile and bottom-right on desktop.
- [ ] Review **all** empty states:
  - No items at all (fresh/empty data): friendly message + "Post the first item" button.
  - No results for filters: shows what was searched + "Clear all filters".
  - No results with search only: suggest checking spelling or removing filters.
- [ ] Error handling: failed post/claim shows an inline error and error toast; the form keeps the user's input.
- [ ] Footer "Reset demo data" link: confirms via `window.confirm`, calls `resetDemoData()`, reloads items.
- [ ] Highlight animation for newly posted/claimed cards (respect reduced motion).
- [ ] Smooth skeleton → content transition (fade-in).
- [ ] Small details: page title updates with result count? (optional), `scroll-margin-top` for sticky header, `text-wrap: balance` for headings, hover/active states on all buttons.

**Acceptance criteria**
- Every user action has visible feedback (success, error, or loading).
- All three empty-state variants and the error state can be triggered and look intentional.
- "Reset demo data" restores the original 24 items.

**Antigravity prompt**
```text
Start Phase 8 from PLAN.md. Add Toast/ToastProvider/useToast, finalise all empty and
error states, the Reset demo data action, and the highlight animation for new items.
Respect prefers-reduced-motion.
```

**Commit:** `feat(ux): add toasts, finalise empty/error states and polish interactions`

---

### Phase 9 — Responsive Refinement & Mobile Filters

**Goal:** Genuinely good on phones, not merely "not broken".

**Tasks**
- [ ] `hooks/useMediaQuery.js` (e.g., `useMediaQuery('(min-width: 1024px)')`).
- [ ] **Mobile/tablet (< 1024px):** the filter panel becomes a **bottom-sheet drawer** opened by a "Filters" button (with a badge showing the number of active filters); includes "Apply"/"Show N results" and "Reset"; closes on backdrop/Esc; can reuse `Dialog`.
- [ ] **Desktop (≥ 1024px):** the same `FilterPanel` renders as a sticky left sidebar (`position: sticky; top: calc(var(--header-height) + 16px)`).
- [ ] Search bar stays visible at the top on mobile; the sort dropdown sits next to the "Filters" button in one row.
- [ ] Touch targets ≥ 44×44 px; inputs have `font-size ≥ 16px` (prevents iOS zoom).
- [ ] Floating "+" Post button on mobile only; inline button in header on ≥ 640px.
- [ ] Post/Detail dialogs are full-screen sheets on mobile with a sticky footer for primary actions.
- [ ] Verify no horizontal scroll at 320, 360, 375, 414, 768, 1024, 1280, 1536 px.
- [ ] Test landscape phone and 200% browser zoom.

**Acceptance criteria**
- All items in the QA matrix (Section 11.3) pass in Firefox Responsive Design Mode.
- No horizontal scrollbar at any tested width.
- One-handed phone use is comfortable (primary actions reachable at the bottom).

**Antigravity prompt**
```text
Start Phase 9 from PLAN.md. Implement the mobile filter drawer (bottom sheet) and
desktop sticky sidebar, useMediaQuery, touch-target sizing, mobile floating Post
button, and full-screen mobile dialogs. Then test at all widths in Section 11.3.
```

**Commit:** `feat(responsive): add mobile filter drawer and refine layouts`

---

### Phase 10 — Accessibility & Performance Pass

**Goal:** Meet a quality bar most applicants skip.

**Tasks — Accessibility** (full checklist in 11.1)
- [ ] Run Firefox's built-in **Accessibility Inspector** (DevTools → Accessibility → Check for issues) and fix what it reports.
- [ ] Run Lighthouse (Chrome) on mobile; target Accessibility ≥ 95.
- [ ] Confirm colour contrast ≥ 4.5:1 for text (including badges and the orange accent on white).
- [ ] Keyboard-only walkthrough of the whole app.

**Tasks — Performance**
- [ ] `loading="lazy"` on card images; `width`/`height` or `aspect-ratio` to prevent layout shift.
- [ ] Memoise heavy derived lists with `useMemo`; wrap `ItemCard` in `React.memo`.
- [ ] Ensure card `key` is `item.id`.
- [ ] Confirm resized upload images are ≤ ~150 KB each.
- [ ] Remove unused CSS/JS/dependencies; check the production bundle size (`npm run build`).
- [ ] Lighthouse mobile Performance ≥ 90.

**Acceptance criteria**
- Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90.
- Complete task flow (browse → search → filter → post → claim) works with keyboard only.

**Antigravity prompt**
```text
Start Phase 10 from PLAN.md. Audit the app against the accessibility and performance
checklists in Section 11, fix all issues you find, and report the before/after for
each fix. Do not add dependencies.
```

**Commit:** `perf(a11y): accessibility and performance improvements`

---

### Phase 11 — Testing & Bug Bash

**Goal:** Confidence that nothing is broken.

**Tasks**
- [ ] (Recommended) Install Vitest (`npm i -D vitest`), add `"test": "vitest run"`. Write unit tests for the pure utilities:
  - `filterItems`: empty query, multi-word AND, category/location/status combinations, no matches.
  - `sortItems`: each mode, tie-breaking, no mutation.
  - `relevance`: title match outranks description match.
  - `distance`: zero distance for same location, symmetry.
  - `validators`: each field's boundaries (2/3/60/61 chars, future date, bad email, 9- and 10-digit phone).
  - `formatDate`: today, yesterday, older.
- [ ] Complete the **manual test script** in Section 11.2 and fix anything that fails.
- [ ] Test on: Firefox (desktop), Chrome (desktop), Firefox/Chrome mobile emulation, and a real phone if available.
- [ ] Test edge cases: very long titles, 0 results, 1 result, 24 results, rapid typing, rapid filter toggling, posting 20 items fast, localStorage cleared mid-session, offline, image failing to load.

**Acceptance criteria**
- All unit tests pass (`npm test`).
- Manual test script has every box ticked.
- `npm run lint` and `npm run build` are clean.

**Antigravity prompt**
```text
Start Phase 11 from PLAN.md. Add Vitest and write unit tests for filterItems,
sortItems, relevance, distance, validators and formatDate. Then walk through the
manual test script in Section 11.2 in the browser and report any failures.
```

**Commit:** `test: add unit tests for utilities and fix issues found in QA`

---

### Phase 12 — README, Documentation & Deployment

**Goal:** A reviewer understands and runs your project in under 2 minutes.

**Tasks**
- [ ] Write `README.md` using the template in Section 12.
- [ ] Add 3–4 screenshots (desktop list, mobile list, post form with preview, claim dialog) in `docs/screenshots/`. Optionally a short GIF of the post flow.
- [ ] Deploy (Section 13) and put the **live link at the top of the README**.
- [ ] Make sure the repo is **public**, has meaningful commits (one per phase), a licence (MIT) and a tidy `.gitignore`.
- [ ] Final fresh-clone test: clone into a new folder, `npm install`, `npm run dev`, confirm it works.
- [ ] Run through the submission checklist (Section 14).

**Acceptance criteria**
- Live site works on a phone, from a fresh browser profile.
- README contains setup steps, features, tech stack, component structure, and decisions/limitations.

**Antigravity prompt**
```text
Start Phase 12 from PLAN.md. Generate README.md from the template in Section 12
using the real file structure and component list in this repo, and prepare the
project for deployment (vite.config base path if needed). Do not invent features
that do not exist.
```

**Commit:** `docs: add README with component structure and deployment config`

---

## 11. Quality Checklists

### 11.1 Accessibility checklist

- [ ] One `<h1>`; headings in logical order; landmarks: `<header>`, `<main>`, `<aside>`, `<footer>`.
- [ ] Skip link works; visible focus on **all** interactive elements.
- [ ] Every input has a visible `<label>`; errors linked via `aria-describedby`; `aria-invalid` set.
- [ ] Status never conveyed by colour alone (icon + text always present).
- [ ] All images have meaningful `alt`; decorative icons `aria-hidden="true"`.
- [ ] Dialogs: labelled (`aria-labelledby`), trap focus (native `<dialog>`), Esc closes, focus returns.
- [ ] Result count and toasts announced through `aria-live="polite"`.
- [ ] Contrast ≥ 4.5:1 (text), ≥ 3:1 (UI borders, focus ring).
- [ ] Works at 200% zoom and with text-size increased; respects `prefers-reduced-motion`.
- [ ] Touch targets ≥ 44px on mobile.

### 11.2 Manual test script

**Browse**
- [ ] Skeletons appear on load, then cards; no layout jump.
- [ ] Each card shows image, name, category, location, date, status.
- [ ] Broken/missing image → placeholder.

**Search & filter**
- [ ] Typing is debounced; clear button and Esc work.
- [ ] "wallet" returns only wallet-related items; multi-word queries work (AND).
- [ ] Each filter works alone and in combination; Reset restores all items.
- [ ] URL updates and restores state on refresh.
- [ ] Zero-result state is helpful and has a working "Clear all filters".

**Sort**
- [ ] Newest / Oldest correct. Nearest changes with reference location. Best match only with a query.

**Post**
- [ ] Empty submit shows summary + focuses first error.
- [ ] Each field's invalid and valid cases behave as specified.
- [ ] Image preview appears, can be removed/changed; invalid file rejected.
- [ ] Successful post appears first, highlighted, persists after refresh.
- [ ] Double-click on Submit does not create duplicates.

**Claim**
- [ ] Correct button label per status; claim form validates.
- [ ] After claiming: status = Claimed everywhere; contact revealed; cannot claim again; persists.

**Misc**
- [ ] `?fail=1` shows error + Retry.
- [ ] Reset demo data restores seed items.
- [ ] No console errors/warnings in any flow.

### 11.3 Responsive QA matrix (Firefox Responsive Design Mode)

| Width | Expected |
|---|---|
| 320 / 360 / 375 | 1 column; filter drawer; floating Post button; no horizontal scroll |
| 414 | Same as above, comfortable spacing |
| 768 | 2 columns; drawer filters; centred dialogs |
| 1024 | Sidebar filters + 3 columns |
| 1280 / 1536 | Sidebar + 4 columns; content capped at 1280px and centred |
| Landscape phone (~667×375) | Dialogs scroll; header does not eat the screen |
| 200% zoom | Layout reflows, no clipped content |

---

## 12. README Template

````markdown
# 🎒 Campus Lost & Found

A responsive lost-and-found interface for VIT Vellore campus: post lost/found items,
search, filter, sort, and claim them. Built as my Frontend task for the
Mozilla Firefox Club (VIT Vellore) recruitment.

**🔗 Live demo:** <link>  |  **📦 Repo:** <link>

## Screenshots
<desktop> <mobile> <post form> <claim dialog>

## Features
**Core**
- Item cards with image, name, category, location, date and status
- Search + filter by category, location and status
- Post lost/found items with a validated form
- Claim items (mock flow, no authentication)
- Local mock JSON data + localStorage persistence

**Extras**
- Debounced search (300 ms) with multi-word matching
- Sort by newest, oldest, nearest location, best match
- Image preview (with client-side resizing) before submitting
- Skeleton loading, empty states, error state with retry
- Inline form validation with helpful messages
- Responsive layout: mobile drawer filters, desktop sidebar
- Shareable URLs (filters stored in the query string)
- Accessible: keyboard navigation, ARIA live regions, reduced-motion support

## Tech Stack
React + Vite · Plain CSS (CSS variables) · lucide-react · Vitest

## Getting Started
```bash
git clone <repo-url>
cd campus-lost-found
npm install
npm run dev        # http://localhost:5173
npm run build
npm test
```
Tip: add `?fail=1` to the URL to preview the error state.

## Component Structure
```text
App
├─ Header
├─ SearchBar
├─ FilterPanel (sidebar / mobile drawer)
├─ ResultsSummary ── SortSelect, ActiveFilterChips
├─ ItemGrid ── ItemCard (ItemImage, Badge) | ItemCardSkeleton
├─ EmptyState / ErrorState
├─ PostItemDialog ── PostItemForm ── FormField, ImageUploader
├─ ItemDetailDialog ── ClaimForm
├─ Toast (ToastProvider)
└─ Footer
```
<short table: component → responsibility>

## Data Flow
`itemsApi` (mock JSON + localStorage) → `useItems` → `filterItems` → `sortItems` → `ItemGrid`.
Filters live in `useFilters` and are mirrored in the URL.

## Design Decisions
- Plain CSS with tokens to keep the styling transparent and lightweight
- Pure utility functions for filtering/sorting/validation so they are unit-tested
- Mock API layer so a real backend can replace it without touching components
- Images are resized client-side before saving to keep localStorage small

## Limitations & Future Work
- No authentication, so claims are not verified
- Data is per-browser (localStorage), not shared between users
- "Nearest" uses a mock coordinate grid, not real GPS/maps
- Ideas: real backend, image upload service, notifications, map view, dark mode

## Folder Structure
<tree from Section 6, trimmed>

## Author
Vaibhav Mittal — <GitHub> · <LinkedIn>
````

---

## 13. Deployment

**Recommended: Vercel or Netlify** (connect the GitHub repo; build command `npm run build`; output `dist`). No extra config needed because data fetches use `import.meta.env.BASE_URL`.

**Alternative: GitHub Pages**
- Set `base: '/<repo-name>/'` in `vite.config.js`.
- Deploy `dist` via GitHub Actions or the `gh-pages` branch.
- Re-check that images and `items.json` load (this is where hard-coded `/paths` break).

After deploying: open the live URL on a phone, in Firefox and Chrome, in a private window, and run through browse → search → post → claim once.

---

## 14. Submission Checklist

- [ ] Working responsive UI (live link works on mobile and desktop).
- [ ] Public GitHub repo link; clean commit history (one meaningful commit per phase).
- [ ] README: live link, screenshots, setup, features, **component structure**, decisions, limitations.
- [ ] All base requirements (R1–R6) fully working.
- [ ] Brownie points implemented and demonstrable: B1–B7.
- [ ] No console errors; `npm run build` passes on a fresh clone.
- [ ] No secrets, no real personal data, no copyrighted images in the repo.
- [ ] Submit **before the deadline** — do the final deployment check at least 24 hours early.

---

## 15. Viva / Interview Prep (write your own answers!)

Prepare short, honest answers in your own words:

1. **Why React + Vite? Why plain CSS instead of Tailwind?**
2. **What is debouncing? Why 300 ms? What happens without it?** (Explain `setTimeout` + cleanup in `useEffect`.)
3. **Walk me through what happens from keypress to updated cards.**
4. **Why are `filterItems` and `sortItems` pure functions? What does "doesn't mutate" mean and why does it matter?**
5. **How does "Nearest" work?** (Mock coordinate grid + Euclidean distance; what would you use in real life — GPS/Haversine/Maps API.)
6. **How does "Best match" scoring work? How would you improve it?** (Fuzzy search, typo tolerance.)
7. **How does image preview work? Why revoke the object URL? Why resize before saving?**
8. **How is form validation structured? Why validate on blur first?**
9. **How does your data persist without a backend? What are the limits of localStorage?**
10. **How is the page responsive?** (Mobile-first, CSS Grid `auto-fill/minmax`, breakpoints, drawer vs sidebar.)
11. **What accessibility work did you do?** (Labels, focus, ARIA live, contrast, native `<dialog>`.)
12. **What would you add with more time? What was the hardest bug?**
13. **How would you connect a real backend?** (Replace `itemsApi.js` with `fetch` to REST endpoints; add auth for claims.)

---

## 16. Common Pitfalls (tell Antigravity to avoid these)

- ❌ Hard-coded absolute paths for JSON/images (breaks on subpath hosting).
- ❌ Mutating state or using `.sort()` directly on the state array.
- ❌ Storing derived data (filtered list) in state.
- ❌ Filtering on every keystroke without debounce; forgetting timer cleanup.
- ❌ Using array index as `key`.
- ❌ Not revoking `URL.createObjectURL` URLs.
- ❌ Saving full-size photos as base64 in localStorage (quota errors).
- ❌ Colour-only status indicators; missing labels; removing focus outlines.
- ❌ Layout shift from images/skeleton size mismatch.
- ❌ Fixed pixel widths that cause horizontal scroll on small phones.
- ❌ Over-engineering (routers, state libraries, UI kits, animation libraries).
- ❌ Copy-pasting code you cannot explain.

---

## 17. Stretch Goals (only after everything above is polished)

1. Dark mode via `prefers-color-scheme` + manual toggle (persisted).
2. Multi-select category filter.
3. Highlight matching text in search results.
4. Simple SVG campus map with pins; click a pin to filter by location.
5. "Recently viewed" or "Save/bookmark" items in localStorage.
6. Share button (`navigator.share` with copy-link fallback).
7. Infinite scroll / "Load more" with 12 items per page.
8. PWA basics (manifest + offline cache).
9. Convert to TypeScript.
10. Playwright smoke test for the post → claim flow.

---

## 18. Suggested Timeline

| Day | Phases | Outcome |
|---|---|---|
| 1 | 0, 1 | Repo live, design system, layout shell |
| 2 | 2, 3 | Data + cards + skeletons (R1, R6 done) |
| 3 | 4 | Search + filters + debounce (R2, R3, B1) |
| 4 | 5 | Sorting incl. nearest (B2) |
| 5–6 | 6 | Post form + validation + image preview (R4, B3, B6) |
| 7 | 7 | Detail + claim (R5) |
| 8 | 8, 9 | Polish + responsive refinement (B5, B7) |
| 9 | 10, 11 | Accessibility, performance, tests |
| 10 | 12 | README, deploy, submit (D1, D2) |

> **Priority order if time runs short:** R1 → R2/R3 → R4 → R5 → B4/B5 → B1 → B6 → B3 → B2 → B7. A complete, polished core beats a half-working feature list.

---

*End of plan. Start with Phase 0.*
