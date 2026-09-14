# RiazAI V2 — Milestone 2 Progress

**Status:** COMPLETE  
**Date:** 2026-09-12  

---

## 1. React Foundation

- Transformed default CRA scaffold into a clean React + Tailwind application
- Installed Tailwind CSS v3, PostCSS, and Autoprefixer
- Verified `npm start` compiles and runs without errors
- All ESLint warnings resolved; build succeeds

---

## 2. Tailwind CSS Setup

- **Config:** `tailwind.config.js` with RiazAI color palette
  - Primary: indigo-50 to indigo-950
  - Neutral: slate-50 to slate-950
  - Success: emerald-100 to emerald-600
  - Warning: amber-100 to amber-600
  - Error: rose-100 to rose-600
  - Font family: Inter, system-ui, sans-serif
- **CSS:** `src/index.css` with `@tailwind base; @tailwind components; @tailwind utilities;`
- **Base styles:** antialiased HTML, bg-slate-50 text-slate-900, button/inputs/card/badge/label base styles
- Verified Tailwind utilities compile and apply correctly

---

## 3. Project Structure

```
src/
├── components/
│   ├── common/     ← Button, Card (with Header/Content/Footer), Badge, Input, EmptyState
│   ├── layout/     ← AppLayout, Sidebar, Topbar, MobileNavigation
│   └── navigation/ ← Navigation data structures and components
├── pages/
│   ├── Landing.jsx
│   ├── Dashboard.jsx
│   ├── Analyse.jsx
│   ├── Sessions.jsx
│   ├── Analytics.jsx
│   ├── Goals.jsx
│   ├── Journal.jsx
│   ├── Coach.jsx
│   ├── Profile.jsx
│   └── Settings.jsx
├── services/
├── hooks/
├── utils/
├── data/
├── assets/
├── App.jsx
└── main.jsx (via index.js)
```

---

## 4. Routing (React Router v7)

- Configured `BrowserRouter` with `Routes` in `src/App.jsx`
- **10 routes** defined:
  - `/` → Landing page
  - `/dashboard` → Dashboard
  - `/analyse` → Analysis workflow
  - `/sessions` → Session history
  - `/analytics` → Progress analytics
  - `/goals` → Practice goals
  - `/journal` → Practice journal
  - `/coach` → AI coach (future feature)
  - `/profile` → Musician profile
  - `/settings` → Application settings
- `/*` catch-all redirects to `/`
- Single navigation configuration shared across Desktop (AppLayout/Sidebar) and Mobile (MobileNavigation)

---

## 5. Application Shell

### AppLayout
- Desktop: persistent sidebar, top header, main content area with `<Outlet>`
- Mobile: compact header, responsive sidebar drawer
- State management for sidebar open/close
- Routes nested inside `<Routes>` element

### Sidebar (Desktop)
- Fixed left sidebar on desktop (`lg:relative lg:translate-x-0`)
- Collapsible to drawer on mobile
- Navigation sections: Main (Dashboard, Analyse, Sessions, Analytics, Goals, Journal, Coach) and Account (Profile, Settings)
- Active route highlighting with `aria-current="page"`
- Demo notice: "Demo mode — no backend connected"

### Topbar (Desktop)
- Fixed top header with RiazAI branding
- Navigation trigger button (mobile hamburger)
- Notifications bell with dropdown
- User menu with profile avatar, Settings link, and Sign out
- Keyboard accessible

### MobileNavigation
- Full-screen drawer on mobile (`translate-x-0` / `translate-x(-100%)`)
- Same navigation sections as Sidebar
- Close button and overlay backdrop
- Accessible `aria-label` and `role` attributes

---

## 6. Reusable Components

### Button
- Variants: primary, secondary, ghost
- Sizes: sm, md, lg
- Full Tailwind styling with focus states

### Card
- Default card with rounded corners and shadow
- `Card.Header`, `Card.Content`, `Card.Footer` sub-components

### Badge
- Variants: primary, success, warning, error
- Small rounded pill component

### Input
- Fully labeled input with error/ helper text support
- `aria-describedby` for accessibility
- Label, input, error message, helper text

### EmptyState
- Flexible placeholder component with optional icon, title, description, and action
- Centered layout with appropriate spacing

---

## 7. Pages (Placeholder Content)

All pages contain intentional placeholder content structured for later backend integration:

- **Landing:** Hero, description, CTA buttons to Dashboard and Analyse
- **Dashboard:** Metric cards (Accuracy, Stability, Consistency, Practice Streak), Progress Trend area, Quick Actions
- **Analyse:** Upload zone with drag-and-drop visual, file picker, format/size hints, results area with score cards
- **Sessions:** Search/filter, empty state message, session cards/table structure
- **Analytics:** Overview metrics cards, trend chart placeholders, practice frequency, areas to improve
- **Goals:** Goal cards with progress bars, goal types (frequency, duration, piece mastery, technical, consistency)
- **Journal:** Entry form with date, instrument, duration, what was practiced, what went well, needs improvement, mood/energy, save functionality
- **Coach:** "AI Coaching Coming Soon" banner, planned capabilities list, clearly marked as future feature
- **Profile:** Avatar, name, instrument, skill level, practice goal, bio, save profile form
- **Settings:** Appearance (theme), Notifications (reminders, summaries), Practice Preferences, Data Management (reset demo data, export)

All pages include demo mode notices and are structured so real data can be plugged in without rewriting UI.

---

## 8. Responsiveness

- Verified mobile layout: no horizontal overflow, readable text, accessible navigation drawer
- Verified tablet layout: sensible spacing, appropriate card widths
- Verified desktop layout: persistent sidebar, comfortable content max-width (max-w-7xl), top header
- Tailwind responsive utilities used throughout (`lg:`, `md:`, `sm:` prefixes)

---

## 9. Accessibility

- Semantic HTML: `<nav>`, `<header>`, `<main>`, `<section>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<svg aria-hidden="true">`
- Visible focus rings: `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
- `aria-label`, `aria-current`, `aria-describedby` used appropriately
- Color contrast: Tailwind slate-900 on slate-50 meets accessibility standards
- Buttons are actual `<button>` elements; links are `<NavLink>` or `<a>`
- Images/icons have `aria-hidden="true"` when decorative

---

## 10. Removed Default Scaffold

- Removed default `App.js` (counter component)
- Removed default `App.css` (App-logo, App-header keyframes)
- Removed `logo.svg` from `src/`
- Updated `index.js` to import `App.jsx`
- Updated `public/index.html` with RiazAI meta tags, description, Google Fonts (Inter), and proper `<title>`

---

## 11. Verification Results

| Check | Result |
|-------|--------|
| `npm install` + Tailwind deps | ✅ Success |
| `npm start` development server | ✅ Runs on http://localhost:3000 |
| `npm run build` production build | ✅ Success |
| Route `/` loads Landing page | ✅ Verified |
| Route `/dashboard` loads Dashboard | ✅ Verified |
| Route `/analyse` loads Analysis page | ✅ Verified |
| Navigation between pages works | ✅ Verified |
| Mobile layout (resize < 640px) | ✅ No overflow, drawer works |
| Desktop layout (resize > 1024px) | ✅ Sidebar visible, header fixed |
| Tailwind classes applied | ✅ Verified via inspect element |
| No console errors | ✅ Clean |
| ESLint errors | ✅ 0 errors |

---

## 12. Deferred to Later Milestones

The following are intentionally deferred per Milestone 2 scope:

- Real backend integration (CORS, REST API endpoints)
- Actual audio analysis / pitch detection
- Session persistence / database
- Authentication / user accounts
- Real chart libraries or data visualisation
- AI coach inference
- LocalStorage persistence (will be added in Milestone 8)
- Full design system (colors, typography, components will evolve)
- Accessibility audit (initial foundation established, will be expanded)

---

## 13. Files Created (New)

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Tailwind CSS configuration |
| `src/components/common/Button.jsx` | Reusable button component |
| `src/components/common/Card.jsx` | Card with Header/Content/Footer sub-components |
| `src/components/common/Badge.jsx` | Badge variant component |
| `src/components/common/Input.jsx` | Form input with label, error, helper text |
| `src/components/common/EmptyState.jsx` | Placeholder component |
| `src/components/layout/AppLayout.jsx` | Application shell with nested routing |
| `src/components/layout/Sidebar.jsx` | Desktop navigation sidebar |
| `src/components/layout/Topbar.jsx` | Top header with branding, notifications, user menu |
| `src/components/navigation/MobileNavigation.jsx` | Mobile navigation drawer |
| `src/components/layout/Landing.jsx` → Wait, this is in pages/ |
| `src/pages/Landing.jsx` | Landing page placeholder |
| `src/pages/Dashboard.jsx` | Dashboard placeholder |
| `src/pages/Analyse.jsx` | Analysis workflow placeholder |
| `src/pages/Sessions.jsx` | Session history placeholder |
| `src/pages/Analytics.jsx` | Progress analytics placeholder |
| `src/pages/Goals.jsx` | Practice goals placeholder |
| `src/pages/Journal.jsx` | Practice journal placeholder |
| `src/pages/Coach.jsx` | AI coach future feature placeholder |
| `src/pages/Profile.jsx` | Musician profile placeholder |
| `src/pages/Settings.jsx` | Application settings placeholder |

---

## 14. Files Modified

| File | Changes |
|------|---------|
| `src/index.css` | Added `@tailwind` directives and base styles |
| `src/App.jsx` | New file: BrowserRouter + Routes + all page routes |
| `src/index.js` | Changed import from `./App` to `./App.jsx` |
| `public/index.html` | RiazAI meta tags, description, Google Fonts, title |
| `package.json` | Added Tailwind/CRA deps (already installed) |
| `RIAZAI_V2_AUDIT.md` | Added Milestone 2 status section |

---

## 15. Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | `^3.0.0` | Utility-first CSS framework |
| `postcss` | `^8.0.0` | PostCSS processor |
| `autoprefixer` | `^10.0.0` | CSS vendor prefixing |

---

## 16. Recommended Next Step

**Milestone 3: Application Shell + Navigation Refinement**

- Polish the AppLayout, Sidebar, and Topbar components
- Add smooth sidebar toggle animations
- Implement responsive breakpoint refinements
- Add breadcrumb navigation
- Create consistent empty states across all pages
- Verify all routes load correctly on first visit
- Begin Milestone 4: Landing Page development

---

## 16. Verification Commands

```bash
# Install dependencies (first time only)
cd ReactApp/myappvercel
npm install

# Start development server
npm start

# Build for production
npm run build

# Run automated tests
npm test
```

---

# RiazAI V2 — Milestone 3 Progress

**Status:** COMPLETE  
**Date:** 2026-09-13  

---

## 1. Milestone 3 Overview

Milestone 3 successfully realized two core objectives:
1. **Application Shell Refinement**: Fully polished `AppLayout`, `Sidebar`, `Topbar`, and `MobileNavigation` components with distinct route SVG icons, React Router v7 active states, synchronized mobile drawer with Escape key dismiss and touch targets, dynamic route breadcrumbs, and zero JSX/rendering bugs.
2. **RiazAI Public Landing Page (`/`)**: Built an authentic, visually compelling, and modular landing page for RiazAI ("Personal Music Practice Intelligence") composed of 9 modular sections in `src/components/landing/`, strictly adhering to product credibility and engineering transparency guidelines.

---

## 2. Shell Refinements & Navigation Improvements

- **Route Metadata Centralization (`navConfig.js`)**:
  - Centralized route titles, breadcrumbs, subtitles, and section groupings (`primary`: Practice & Analysis, `secondary`: Account).
  - Defined all 9 authenticated application routes: `/dashboard`, `/analyse`, `/sessions`, `/analytics`, `/goals`, `/journal`, `/coach`, `/profile`, `/settings`.
  - Added helper `getRouteMetadata(pathname)` for dynamic topbar synchronization and document title updates.
- **Dedicated Route Icons (`NavIcons.jsx`)**:
  - Implemented high-precision, semantic SVG icon components for each route (replacing generic duplicated icons).
  - Added geometric `BrandIcon` for RiazAI soundwave branding.
- **Desktop Sidebar (`Sidebar.jsx`)**:
  - Persistent, fixed desktop sidebar (`hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0`).
  - Active route indication via React Router v7 `NavLink` (`isActive`, `aria-current="page"`).
  - Clear visual hierarchy with primary practice routes, roadmap badge on Coach, and account routes.
  - Musician profile footer snippet with "Local Prototype" status indicator.
- **Adaptive Topbar (`Topbar.jsx`)**:
  - Dynamic page title and breadcrumb trail updating on every route change.
  - Quick action CTA ("New Practice") linking directly to `/analyse`.
  - Quick navigation back to public Landing page.
  - Notification popover with unread indicator, keyboard dismiss (Escape), and outside-click handler.
  - Musician user profile menu with avatar pill, profile/settings links, and landing redirect.
  - Accessible mobile hamburger toggle button (`lg:hidden`).
- **Mobile Navigation Drawer (`MobileNavigation.jsx`)**:
  - Responsive slide-out drawer with backdrop blur overlay.
  - Full keyboard accessibility (Escape key closes drawer).
  - Auto-close on route selection.
  - Minimum 44x44px touch targets.
  - Fixed duplicate default export syntax error.

---

## 3. Landing Page Implementation (`src/components/landing/`)

Structured as 9 modular, reusable components in `src/components/landing/`:

1. **Navbar (`Navbar.jsx`)**:
   - Sticky header with scroll backdrop blur, brand logo, in-page anchor links (`#problem`, `#capabilities`, `#how-it-works`, `#preview`, `#progress`), and direct action buttons ("Explore Dashboard", "Start Analysing").
   - Responsive mobile navigation drawer.
2. **Hero (`Hero.jsx`)**:
   - Eyebrow: `PERSONAL MUSIC PRACTICE INTELLIGENCE`.
   - Headline: *"Practice with purpose. Understand your progress."*
   - Subtitle: *"RiazAI helps musicians turn practice sessions into structured insights, consistency tracking, and actionable improvement."*
   - Dual CTAs: Primary "Start Analysing" and Secondary "Explore Dashboard".
   - Product demonstration preview card with neutral prototype metrics (Performance Score 88%, Session Consistency 84%, Practice Duration 35m, 5-Day Streak).
3. **Problem Section (`ProblemSection.jsx`)**:
   - 4 musician-centric challenge cards:
     - 01 Vanished Practice History
     - 02 Subjective Self-Evaluation
     - 03 Consistency Blindspots
     - 04 Disconnected Repetition
4. **Core Capabilities (`CapabilitiesSection.jsx` & `CapabilityCard.jsx`)**:
   - 4 capabilities with credibility badges:
     - **Audio Analysis** (*Prototype Active*): Audio-based practice analysis, performance metrics, and structured session feedback.
     - **Practice Tracking** (*Core Feature*): Session logging, practice duration history, routine tracking, and streak measurement.
     - **Progress Analytics** (*Core Feature*): Longitudinal consistency trends and milestone measurement across weeks of practice.
     - **Personalized Insights** (*Product Direction*): Structured focus areas and practice prompts to guide deliberate practice.
   - **Credibility & Scope Comparison Box**: Explicitly distinguishes Current Prototype State (heuristic audio-byte amplitude & energy) from the Future Product Roadmap (pitch/F0, intonation, rhythm, AI coaching).
5. **How It Works (`HowItWorks.jsx`)**:
   - 4 sequential steps: `01 Practice` → `02 Analyse` → `03 Understand` → `04 Improve`.
6. **Dashboard Preview (`DashboardPreview.jsx`)**:
   - Realistic desktop dashboard mockup labeled with *"Interactive product preview — Demonstration data"*.
   - Performance Score (88%), Session Consistency (84%), Practice Time (6.4 hrs), Practice Streak (5 Days).
   - SVG vector consistency trend chart across last 6 sessions.
   - Illustrative recommendation card: *"Example focus area: Upper register transition consistency"*.
7. **Progress / Insight Section (`InsightSection.jsx`)**:
   - Illustrates long-term compounding value: `Session` → `Trend` → `Goal` → `Improvement`.
8. **Call to Action (`CTASection.jsx`)**:
   - Closing banner: *"Your practice deserves more than a recording."*
   - Dual action CTAs linking to `/analyse` and `/dashboard`.
9. **Footer (`Footer.jsx`)**:
   - RiazAI branding, platform links, account links, prototype notice, and copyright.

---

## 4. Credibility & Honesty Guidelines Enforced

- **Zero False AI Claims**: No claims of pitch detection, F0 estimation, intonation tracking, or automatic note detection.
- **Prototype Metrics**: Demonstrations strictly use *Performance Score*, *Session Consistency*, *Practice Time*, and *Practice Streak*.
- **Demonstration Data Tags**: Every preview card and mockup is prominently marked as *"Interactive product preview — Demonstration data"*.
- **Illustrative Recommendations**: Labeled as *"Example focus area"* and *"Demonstration insight"*.
- **Engineering Transparency**: Transparent roadmap card comparing heuristic amplitude engine with future acoustic analysis.

---

## 5. Reusable Components Created / Modified

| Component | Path | Purpose |
|-----------|------|---------|
| `Navbar` | `src/components/landing/Navbar.jsx` | Landing navigation header |
| `Hero` | `src/components/landing/Hero.jsx` | Landing hero with demonstration card |
| `ProblemSection` | `src/components/landing/ProblemSection.jsx` | 4 musician dilemma cards |
| `CapabilityCard` | `src/components/landing/CapabilityCard.jsx` | Reusable capability card |
| `CapabilitiesSection` | `src/components/landing/CapabilitiesSection.jsx` | 4 capabilities + roadmap comparison |
| `HowItWorks` | `src/components/landing/HowItWorks.jsx` | 4-step deliberate practice cycle |
| `DashboardPreview` | `src/components/landing/DashboardPreview.jsx` | Product UI demonstration mockup |
| `InsightSection` | `src/components/landing/InsightSection.jsx` | Long-term compounding value cards |
| `CTASection` | `src/components/landing/CTASection.jsx` | Final high-impact call to action |
| `Footer` | `src/components/landing/Footer.jsx` | Product footer & legal links |
| `BrandIcon`, `NavIcon` | `src/components/navigation/NavIcons.jsx` | Semantic SVGs for all routes |
| `navConfig` | `src/components/navigation/navConfig.js` | Centralized route metadata & breadcrumbs |
| `Badge` | `src/components/common/Badge.jsx` | Added neutral variant support |

---

## 6. Verification Results

| Check | Result |
|-------|--------|
| `cmd.exe /c npm run build` production build | ✅ Success (0 errors, 0 warnings) |
| `cmd.exe /c npm start` local dev server | ✅ Running on http://localhost:3000 |
| `cmd.exe /c "set CI=true && npm test"` | ✅ PASS: 5/5 tests passing |
| Landing page 9 sections rendered | ✅ Verified |
| Application Shell routing (all 9 routes) | ✅ Verified |
| Sidebar active route highlighting | ✅ Verified |
| Mobile Navigation drawer open/close + Escape key | ✅ Verified |
| 404 catch-all redirect to `/` | ✅ Verified |
| Credibility metrics & demo notices | ✅ Verified |

---

## 7. Deferred Functionality

- Real pitch/F0 estimation and intonation tracking (Deferred to later audio engine milestones).
- Backend REST API integration & database persistence (Deferred to backend milestones).
- Real-time intelligent audio feedback & AI coaching (Deferred to Coach milestone).

---

## 8. Recommended Next Milestone

**Milestone 4: Core Practice & Analysis Workflow Prototype** (COMPLETED)

---

# RiazAI V2 — Milestone 4 Progress

**Status:** COMPLETE  
**Date:** 2026-09-13  

---

## 1. Milestone 4 Overview

Milestone 4 transformed RiazAI from a polished shell and landing page into an interactive, working frontend product experience. The two core application pages — **`/dashboard`** and **`/analyse`** — were completely rebuilt with dedicated components, an intuitive state-driven analysis workflow, a centralized 10 MB upload contract, and local storage persistence.

---

## 2. Centralized Audio Upload Contract

- **Contract Config (`src/config/audioConfig.js`)**:
  - `MAX_AUDIO_FILE_SIZE_MB = 10`
  - `MAX_AUDIO_FILE_SIZE_BYTES = 10 * 1024 * 1024`
  - `ACCEPTED_AUDIO_TYPES`: `audio/mpeg`, `audio/wav`, `audio/x-wav`, `audio/mp4`, `audio/x-m4a`, `audio/ogg`, `audio/flac`
  - `ACCEPTED_AUDIO_EXTENSIONS`: `.mp3`, `.wav`, `.m4a`, `.ogg`, `.flac`
- **Application**:
  - Centralized file validation function `validateAudioFile(file)` enforcing both file format and 10 MB size limits.
  - Dropzone UI messaging: *"Supported: MP3, WAV, M4A, OGG, FLAC • Max size: 10 MB"*.
  - Hidden file input `accept` attribute automatically synchronized with accepted extensions.

---

## 3. Dashboard Experience (`/dashboard`)

- **Header & Action CTAs**:
  - Dynamic route metadata title and prototype mode badge.
  - Supporting text: *"Welcome back, Musician. Here is your practice consistency overview and recent activity."*
  - Dual action CTAs: Primary *"Analyse a Session"* (links to `/analyse`) and Secondary *"Log Practice"* (links to `/journal`).
- **4 Overview Metric Cards (`MetricCard.jsx`)**:
  - **Performance Score**: `88%` (+4% trend, prototype consistency benchmark).
  - **Session Consistency**: `84%` (High signal energy stability index).
  - **Practice Time**: `6.4 hrs` (Target: 7.0 hrs / week, 91% reached).
  - **Practice Streak**: `5 days` (Active streak, personal best 12 days).
- **Weekly Practice Overview (`PracticeOverview.jsx`)**:
  - Total sessions count, total hours practiced vs weekly goal.
  - Goal completion progress bar (91%).
  - Day-by-day practice continuity indicators (Mon–Fri logged, Sat–Sun pending).
- **Progress Trend Chart (`ProgressTrend.jsx`)**:
  - Lightweight, responsive SVG area and polyline trend curve showing consistency across the last 6 practice sessions.
  - Prominently labeled with *"Demonstration progress data"*.
- **Recent Sessions (`SessionCard.jsx`)**:
  - Reusable session items displaying title, instrument, duration, practice focus tag, demo score (e.g. 88%), and status.
  - Dynamically read from `getStoredSessions()` with localStorage persistence.
- **Focus Area Recommendation (`FocusAreaCard.jsx`)**:
  - Targeted practice prompt: *"Upper-register transition consistency"*.
  - Explicitly tagged as *"Illustrative recommendation — demonstration insight"*.
  - Includes suggested exercise routine and disclaimer: *"Not based on automated weakness detection"*.
- **Quick Actions (`QuickActions.jsx`)**:
  - Interactive shortcuts: *Analyse Session*, *Log Practice*, *View Sessions*, *Set Goal*.

---

## 4. Audio Analysis Workflow (`/analyse`)

State-driven architecture with 3 clean phases:

1. **State 1: READY**:
   - `AudioDropzone.jsx`: Accessible drag-and-drop file target with custom keyboard navigation, format hints, 10 MB limit text, and live error alerts.
   - `SelectedFile.jsx`: Displays selected audio filename, formatted file size, audio format pill, remove button, and *"Analyse Recording"* CTA.
   - Explainer Card: Educational overview of how the heuristic engine operates.
2. **State 2: ANALYSING**:
   - `AnalysisProgress.jsx`: Smooth simulated progress indicator with animated sound bars.
   - Staged status messaging:
     - 20%: *"Reading audio waveform & signal envelope..."*
     - 50%: *"Computing acoustic amplitude & energy stability..."*
     - 80%: *"Evaluating session consistency benchmarks..."*
     - 95%: *"Structuring practice summary & recommendations..."*
     - 100%: *"Analysis complete! Finalizing results..."*
   - Accessible `aria-live="polite"` announcements.
   - Prominent disclaimer: *"Frontend Demonstration • Simulated Analysis Delay"*.
3. **State 3: RESULTS**:
   - `AnalysisResults.jsx`: Polished results view with prominent *"Demonstration analysis — prototype metrics"* banner.
   - `MetricBreakdown.jsx`: Detailed breakdown of *Performance Score (86%)*, *Accuracy (88%)*, *Stability (84%)*, and *Consistency (87%)*.
   - Session Feedback Summary and observed focus points.
   - Session Take Details (filename, duration, stability status, dynamic range).
   - Suggested Next Step recommendation card.
   - Action controls:
     - *"Save Session"*: Persists the new session take into `localStorage` and provides visual success confirmation.
     - *"Analyse Another"*: Resets the state back to READY with an empty file selector.
     - *"View Dashboard"*: Direct link to `/dashboard`.

---

## 5. Demo Data Architecture & Local Storage

- **`src/data/demoData.js`**: Separated all prototype metrics, sessions, overview numbers, progress points, focus areas, and analysis templates from UI code.
- **`src/utils/storage.js`**: Safe `localStorage` utility with in-memory fallback for environments where storage is blocked:
  - `getStoredSessions()` & `saveSession(session)`: Merges default demo sessions with user-saved session entries.
  - `getStoredAnalysis()` & `saveAnalysisResult(result)`: Stores the latest analysis outcome.

---

## 6. Verification Results

| Check | Result |
|-------|--------|
| `cmd.exe /c npm run build` (Root & ReactApp) | ✅ Success (0 errors, 0 warnings) |
| `cmd.exe /c npm test` (Root & ReactApp) | ✅ PASS: 11/11 tests passing |
| Dashboard 4 metric cards rendered | ✅ Verified |
| Dashboard recent sessions rendered | ✅ Verified |
| Analysis starts in READY state with 10 MB limit | ✅ Verified |
| File selection updates UI with file details | ✅ Verified |
| Invalid file triggers validation error alert | ✅ Verified |
| Analysis simulation transitions to Results | ✅ Verified |
| Results display demonstration analysis banner | ✅ Verified |
| Save Session updates local storage | ✅ Verified |
| "Analyse Another" resets workflow to READY | ✅ Verified |
| Responsive layout across 320px–1440px+ | ✅ Verified |
| No horizontal scrolling | ✅ Verified |

---

## 7. Deferred Functionality

- Real pitch/F0 estimation and microtonal intonation tracking (Deferred to later audio analysis milestones).
- Backend Spring Boot REST API integration & database persistence (Deferred to backend milestone).
- Real-time intelligent audio feedback & AI coaching (Deferred to Coach milestone).

---

## 8. Recommended Next Milestone

**Milestone 5: Sessions & Analytics Experience** (COMPLETED)
- Full implementation of `/sessions` page with filtering, search, and sorting.
- Expanded session detail view with audio playback simulation and practice notes.
- Practice export functionality (JSON / CSV session logs).

---

# RiazAI V2 — Milestone 5 Progress

**Status:** COMPLETE  
**Date:** 2026-09-13  

---

## 1. Milestone 5 Overview

Milestone 5 transformed RiazAI from a single-session demonstration into a longitudinal practice system. The `/sessions` and `/analytics` placeholder pages were replaced with fully realized, interactive experiences powered by a canonical session data model and persistent local storage.

**Key Principles Enforced:**
1. **Frontend-Only**: No Spring Boot backend changes, no database, no REST APIs, no real AI or pitch detection.
2. **True Derivation**: Analytics metrics are derived directly from stored practice sessions — no arbitrary disconnected mock numbers.
3. **Data Continuity**: Practice takes saved from `/analyse` immediately appear on the Dashboard, in `/sessions`, and factor into `/analytics`.
4. **Lightweight & Accessible**: Zero bulky chart libraries; clean, responsive SVG data visualisations with screen-reader friendly descriptions.
5. **Deliberate Low-Data & Empty States**: Graceful UX for 0, 1, 2–3, and multiple sessions.

---

## 2. Canonical Data Model

Every session (both demonstration takes and user-saved takes) adheres to a unified schema:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g. `sess-042`, `sess-<timestamp>`) |
| `title` | string | Session title |
| `date` | string | Human-readable date/time |
| `instrument` | string | Instrument name (e.g. `Vocal / Sitar`, `Sitar`, `Sarod`) |
| `duration` | string | Human-readable duration (e.g. `35m`) |
| `durationMinutes` | number | Numeric duration for aggregation |
| `score` | number | Overall performance score (0–100) |
| `accuracy` | number | Prototype acoustic stability score (0–100) |
| `stability` | number | Signal energy stability index (0–100) |
| `consistency` | number | Consistency benchmark score (0–100) |
| `consistencyLabel` | string | `High` | `Steady` | `Moderate` |
| `focus` | string | Practice focus area description |
| `status` | string | `Completed` |
| `source` | string | `demo` (demonstration) vs `user` (authentic practice take) |
| `createdAt` | string | ISO 8601 timestamp |
| `feedback` | string | Automated signal observations summary |
| `nextStep` | string | Suggested next practice prompt |

---

## 3. Storage Layer (`src/utils/storage.js`)

Centralized `localStorage` access with in-memory fallback:

- **`normalizeSession(session)`**: Gracefully fills missing canonical fields with safe defaults.
- **`getStoredSessions()`**: Reads stored array; returns demo sessions on first load (null key) and empty array if user cleared sessions.
- **`saveSession(session)`**: Inserts new session at head, generates unique ID, defaults `source: 'user'`, calculates `durationMinutes`, persists to storage.
- **`deleteSession(sessionId)`**: Removes matching session, saves resulting array, returns updated list.
- **`resetToDemoSessions()`**: Restores initial default demo sessions.
- **`getStoredSessionById(id)`**: Utility to find a single session by ID.
- **`parseDurationToMinutes(durationStr)`**: Parses `35m`, `1h 20m`, `3m 42s` into numeric minutes.

---

## 4. Analytics Calculations (`src/utils/analyticsCalculations.js`)

Pure computation utilities deriving all values directly from session arrays:

- **`calculateOverview(sessions)`**: Total sessions, total minutes, formatted time, average score, average consistency.
- **`calculatePerformanceBreakdown(sessions)`**: Average accuracy, stability, and consistency.
- **`calculateHighlights(sessions)`**: Strongest session (max score), longest session (max duration), score delta (earliest to latest).
- **`calculateProgressTrend(sessions)`**: Chronological data points for SVG trend rendering.
- **`calculatePracticeFrequency(sessions)`**: Minutes per session in chronological order.
- **`getUniqueInstruments(sessions)`**: Extracts unique instrument names for filter dropdowns.
- **`getFocusTags(sessions)`**: Extracts unique practice focus tags from session data.

---

## 5. Practice Sessions Page (`/sessions`)

### SessionListCard (`src/components/sessions/SessionListCard.jsx`)
- Reusable session card with title, date, duration, instrument badge, demo/user source badge, practice focus, score meter.
- Action buttons: "Details" and "Delete" with accessible `aria-label` attributes.

### SessionDetailModal (`src/components/sessions/SessionDetailModal.jsx`)
- Accessible modal dialog with backdrop blur, Escape key dismissal, backdrop click closing.
- Full take information: Overall Score, Accuracy, Stability, Consistency.
- Prototype feedback summary, focus notes, suggested next steps.
- Visual indicator of demonstration vs user take (amber banner for demo sessions).
- Actions: Delete session, Close.
- Body scroll lock while open; focus management on panel open.

### Sessions Page (`src/pages/Sessions.jsx`)
- **Header**: "Practice Sessions" with session count badge and "Analyse Session" CTA.
- **Summary Banner**: 4 metrics — Total Sessions, Practice Time, Average Score, Average Consistency (all derived from stored sessions).
- **Search & Filter Controls**: Search input, instrument filter (dynamic), source filter (All/User/Demo), sort order (Newest/Highest/Longest).
- **Session List**: Rendered `SessionListCard` components for filtered results.
- **Empty States**: 0 sessions total (CTA to `/analyse`); 0 filter matches (Clear Filters CTA).
- **Footer**: Session count, View Analytics link, Reset to Demo Data action.

---

## 6. Analytics Page (`/analytics`)

### ProgressChart (`src/components/analytics/ProgressChart.jsx`)
- Responsive SVG line chart with area fill, dual trend lines (Score + Consistency).
- Handles 0 sessions (empty state), 1 session (single benchmark point with notice), 2–3 sessions (Early Data badge), 4+ sessions (full trend).
- Screen reader accessible via `role="img"` and `aria-label`.

### PracticeFrequencyChart (`src/components/analytics/PracticeFrequencyChart.jsx`)
- Responsive SVG bar chart showing practice minutes per session.
- Horizontal grid lines, bar labels, x-axis session labels.
- Handles empty state with calendar icon placeholder.

### MetricTrend (`src/components/analytics/MetricTrend.jsx`)
- Comparative progress-bar breakdown of Accuracy, Stability, and Consistency averages.
- `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Prototype metric subtitles on each bar.

### Analytics Page (`src/pages/Analytics.jsx`)
- **A. Overview**: 4 metric cards — Total Sessions, Practice Time, Avg Score, Avg Consistency.
- **B. Progress Trend**: `ProgressChart` with data count awareness.
- **C. Practice Frequency**: `PracticeFrequencyChart` showing session distribution.
- **D. Performance Breakdown**: `MetricTrend` comparing accuracy, stability, consistency.
- **E. Highlights & Achievements**: Strongest session, longest take, score delta.
- **F. Focus Areas**: Derived practice focus tags with transparent prototype disclaimer.
- **Empty State**: Full-page `EmptyState` prompting to analyse first take.
- **Prototype Notice**: Footer disclaimer that values are computed from stored session data.

---

## 7. Data Flow Integration

- **`AnalysisResults.jsx`** `handleSaveSession`: Saves all canonical attributes (accuracy, stability, consistency, durationMinutes, source: 'user', feedback, nextStep, createdAt).
- **`Dashboard.jsx`**: Reads stored sessions via `getStoredSessions()` for recent sessions list.
- **`Sessions.jsx`**: Full CRUD — read, filter, sort, delete, reset.
- **`Analytics.jsx`**: Pure derivation — reads sessions, computes all metrics via calculation utilities.

---

## 8. Navigation & Routing

- **`App.jsx`**: `Sessions` and `Analytics` imported directly (no placeholder wrappers).
- Routes: `/sessions` → `Sessions`, `/analytics` → `Analytics`.
- Cross-page navigation links verified: Dashboard → Sessions, Sessions → Analytics, Analytics → Sessions, all → Analyse.

---

## 9. Files Created (New)

| File | Purpose |
|------|---------|
| `src/components/sessions/SessionListCard.jsx` | Reusable session card for session history |
| `src/components/sessions/SessionDetailModal.jsx` | Accessible slide-over modal for session details |
| `src/components/analytics/ProgressChart.jsx` | SVG line chart for session-by-session performance trend |
| `src/components/analytics/PracticeFrequencyChart.jsx` | SVG bar chart for practice minutes per session |
| `src/components/analytics/MetricTrend.jsx` | Comparative accuracy/stability/consistency breakdown |
| `src/utils/analyticsCalculations.js` | Pure computation utilities for analytics derivation |

---

## 10. Files Modified

| File | Changes |
|------|---------|
| `src/data/demoData.js` | Enriched `recentSessions` with all canonical fields |
| `src/utils/storage.js` | Enhanced with `deleteSession`, `resetToDemoSessions`, `getStoredSessionById`, `normalizeSession` |
| `src/components/analysis/AnalysisResults.jsx` | Updated `handleSaveSession` to save all canonical attributes |
| `src/pages/Sessions.jsx` | Complete implementation replacing placeholder |
| `src/pages/Analytics.jsx` | Complete implementation replacing placeholder |
| `src/App.jsx` | Already imported real Sessions/Analytics (no placeholder swaps needed) |
| `src/App.test.js` | Added 9 comprehensive Milestone 5 tests |

---

## 11. Test Results

| Test | Status |
|------|--------|
| Sessions page renders header, summary metrics, and session cards | ✅ PASS |
| Saved audio analysis appears in Sessions history | ✅ PASS |
| Search and instrument filtering in Sessions works correctly | ✅ PASS |
| Empty sessions state renders properly when session history is empty | ✅ PASS |
| Session detail modal opens with take metrics and closes via Escape | ✅ PASS |
| Analytics page derives overview metrics dynamically from sessions | ✅ PASS |
| Analytics page gracefully handles empty state (0 sessions) | ✅ PASS |
| Deleting a session removes it from the list | ✅ PASS |
| Navigation between Dashboard, Sessions, Analytics, and Analyse is connected | ✅ PASS |

**Total: 20/20 tests passing** (11 existing Milestone 3–4 + 9 new Milestone 5)

---

## 12. Verification Results

| Check | Result |
|-------|--------|
| `npm run build` production build | ✅ Success (0 errors) |
| `npm test` — all tests | ✅ 20/20 passing |
| `/sessions` renders header, summary, filters, session cards | ✅ Verified |
| Session detail modal: Escape key, backdrop click, metrics display | ✅ Verified |
| Delete session: card removed, counters update | ✅ Verified |
| `/analyse` → Save → `/sessions` shows new session at top | ✅ Verified |
| `/analytics` overview metrics derived from stored sessions | ✅ Verified |
| Empty state (0 sessions) renders gracefully on `/sessions` and `/analytics` | ✅ Verified |
| Responsive layout (320px–1440px+) | ✅ No horizontal overflow |
| Screen reader accessibility (aria-label, role, aria-live) | ✅ Verified |

---

## 13. Deferred Functionality

- Real pitch/F0 estimation and microtonal intonation tracking (Deferred to later audio analysis milestones).
- Backend Spring Boot REST API integration & database persistence (Deferred to backend milestone).
- Real-time intelligent audio feedback & AI coaching (Deferred to Coach milestone).
- Practice session export functionality (JSON / CSV session logs).
- Client-side Web Audio API recorder / audio preview playback.
- Heuristic acoustic feature extraction prototype.
- Audio waveform visualizer.

---

## 14. Recommended Next Milestone

**Milestone 6: Practice Goals & Journal Experience**
- Full implementation of `/goals` page with practice goal setting, tracking, and progress visualization.
- Full implementation of `/journal` page with practice journal entries, reflection prompts, and session notes.
- Goal types: frequency targets, duration targets, piece mastery, technical milestones, consistency streaks.
- Journal entries linked to practice sessions with mood/energy tracking.

- Client-side Web Audio API recorder / audio preview playback.
- Heuristic acoustic feature extraction prototype.
- Audio waveform visualizer and structured session feedback display.

---

# RiazAI V2 — Milestone 7 Progress

**Status:** COMPLETE  
**Date:** 2026-09-14  

---

## 1. Milestone 7 Overview

Milestone 7 replaced RiazAI's simulated/heuristic analysis path with a real backend-driven F0 (fundamental frequency) pitch analysis pipeline. The validated YIN algorithm spike was integrated into the existing Spring Boot backend, a REST API was created, and the React frontend was updated to call the real backend, display F0-derived metrics, and persist real analysis sessions — all while preserving the demo/prototype fallback path.

**Scope:** Audio upload → Backend F0 analysis → Derived pitch metrics → React display → Session persistence.

---

## 2. Backend Changes

### New Files Created

| File | Purpose |
|------|---------|
| `model/AnalysisResponse.java` | JSON response model (Java records, `@JsonInclude(NON_NULL)`) |
| `service/F0AnalysisService.java` | F0 pipeline + preprocessing (DC offset, normalization, silence trimming) |
| `service/AnalysisOrchestrationService.java` | Orchestrates real F0 analysis with demo fallback |
| `controller/AnalysisController.java` | REST API: POST /api/analyse, GET /api/health |
| `config/WebConfig.java` | CORS configuration for React frontend |

### Files Modified

| File | Changes |
|------|---------|
| `spike/f0/SyntheticAudioGenerator.java` | Fixed WAV decoder: correct fmt chunk offsets, fixed `findChunk` data offset |
| `application.properties` | Added multipart config, Jackson non-null serialization, server port |

### Bug Fixes

1. **WAV decoder byte offsets** — `readShort`/`readInt` for fmt chunk fields were reading from incorrect positions (`fmtOffset+10` instead of `fmtOffset+2`). Fixed to standard WAV fmt layout.
2. **`findChunk` data offset** — Returned `offset+8` (size field position) instead of actual data position. Fixed data chunk reading to use `dataOffset-4` for size and `dataOffset` for data start.
3. **Preprocessing division by zero** — `removeDCOffset` on empty array caused `0/0 = NaN`. Added early return for empty samples after silence trimming.

---

## 3. API Endpoint

```
POST /api/analyse
Content-Type: multipart/form-data
Body: audioFile=<audio bytes>

→ 200 OK: AnalysisResponse JSON (real F0 or demo fallback)
→ 400 Bad Request: Validation error (empty file, too large)
→ 500 Server Error: Unexpected processing failure

GET /api/health
→ 200 OK: { "status": "ok", "service": "riazai-backend", "version": "f0-yin-1.0" }
```

---

## 4. Frontend Changes

### New Files Created

| File | Purpose |
|------|---------|
| `src/services/api.js` | API client: uploadForAnalysis, checkBackendHealth, error normalization |
| `src/components/analysis/F0MetricCard.jsx` | Reusable F0 metric display card |
| `src/components/analysis/F0AnalysisResults.jsx` | Real F0 results display (median pitch, range, stability, voicing ratio) |

### Files Modified

| File | Changes |
|------|---------|
| `src/pages/Analyse.jsx` | Added UPLOADING/ANALYSING states, real backend call, demo fallback |
| `src/components/analysis/AnalysisProgress.jsx` | Real progress states (uploading, analysing, complete) |
| `src/components/analysis/AnalysisResults.jsx` | Handles both real F0 and demo results, saves F0 sessions |
| `src/components/analysis/SelectedFile.jsx` | Updated to reference F0 analysis |
| `src/utils/storage.js` | Added F0 session fields, backward compatibility for demo sessions |
| `src/components/sessions/SessionDetailModal.jsx` | Displays F0 metrics for real sessions, legacy for demo |
| `src/components/sessions/SessionListCard.jsx` | Shows pitch/stability for F0 sessions |
| `src/pages/Analytics.jsx` | Handles mixed session history, F0 trend section |
| `src/pages/Dashboard.jsx` | Shows real F0 summary when available |
| `src/App.test.js` | Updated tests for new analysis flow (mock API) |

---

## 5. Analysis Flow

```
READY → User selects file
UPLOADING → File sent to backend
ANALYSING → Backend YIN processing
RESULTS → F0 metrics displayed (real) or demo metrics (fallback)
```

Backend unavailable → Automatic demo fallback (no artificial delay).

---

## 6. Test Results

### Backend: 55/55 PASS ✅

| Test Class | Tests |
|-----------|:---:|
| `F0SpikeTest` (YIN, metrics, pipeline, WAV, violin) | 34 |
| `F0AnalysisServiceTest` (WAV decode, preprocessing, F0 metrics, schema, fallback) | 15 |
| `AnalysisControllerTest` (response schema, silence, fallback, real analysis) | 6 |

### Frontend: 20/20 PASS ✅

All existing Milestone 3–5 tests preserved. Updated 2 tests for new analysis flow with API mocking.

### Build: PASS ✅

---

## 7. What Was NOT Changed

- No AI APIs introduced
- No ML-based coaching
- No intonation/vibrato scoring
- No automatic transcription
- No authentication
- No database
- No removal of existing frontend features
- No changes to Landing page
- No changes to Goals, Journal, Coach, Profile, Settings pages

---

## 8. Recommended Next Milestone

**Milestone 8: Multi-format Audio Support & Extended Metrics**

- Add MP3/FLAC/OGG decoding via Java AudioSystem or TarsosDSP
- Extend F0 analysis with onset detection and note segmentation
- Add pitch contour visualization (SVG chart)
- Implement pitch accuracy scoring against reference scale
- Begin SwiftF0 Python microservice evaluation for higher accuracy
- Backend session persistence (database)
- Authentication & user accounts