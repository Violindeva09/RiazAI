# RiazAI V2 — Analysis Readiness Document

**Status:** Technical Specification  
**Date:** 2026-09-13  
**Scope:** Pre-Milestone 6 boundary document — establishes the clean separation between current prototype metrics and future research-backed audio analysis.  
**Constraint:** No application behaviour is changed by this document. This is a reference specification only.

---

## 1. Current Canonical Session Schema

Every session stored in `localStorage` under the key `riazai_sessions` adheres to this shape, enforced by `normalizeSession()` in `src/utils/storage.js`:

```js
{
  id:              string   // 'sess-<timestamp>' or 'sess-042'
  title:           string   // 'Morning Riaz — Sustained Notes Drill'
  date:            string   // 'Today, 7:30 AM' (display-only, not machine-readable)
  duration:        string   // '35m' (display-only)
  durationMinutes: number   // 35 (derived, used for aggregation)
  instrument:      string   // 'Vocal / Sitar', 'Sitar', 'Sarod', 'Vocal'
  focus:           string   // 'Volume steadiness & breath control'
  score:           number   // 0–100 (overall performance composite)
  accuracy:        number   // 0–100 (prototype: signal envelope match)
  stability:       number   // 0–100 (prototype: energy/amplitude steadiness)
  consistency:     number   // 0–100 (prototype: phrase dynamic continuity)
  consistencyLabel: string  // 'High' | 'Steady' | 'Moderate'
  status:          string   // 'Completed'
  source:          string   // 'demo' | 'user'
  createdAt:       string   // ISO 8601 timestamp
  feedback:        string   // free-text summary of signal observations
  nextStep:        string   // suggested next practice prompt
}
```

**Origin of each field:**

| Field | Demo Sessions | User-Saved Sessions | Source File |
|-------|---------------|---------------------|-------------|
| `id` | Hardcoded `sess-042` etc. | Generated `sess-<Date.now()>` | `demoData.js`, `storage.js:saveSession()` |
| `score` | Hardcoded 79–88 | `results.overallScore` | `demoData.js`, `AnalysisResults.jsx` |
| `accuracy` | Hardcoded 81–90 | `results.accuracy` | `demoData.js`, `AnalysisResults.jsx` |
| `stability` | Hardcoded 77–86 | `results.stability` | `demoData.js`, `AnalysisResults.jsx` |
| `consistency` | Hardcoded 79–88 | `results.consistency` | `demoData.js`, `AnalysisResults.jsx` |
| `feedback` | Hardcoded demo strings | `results.feedbackSummary` | `demoData.js`, `AnalysisResults.jsx` |
| `nextStep` | Hardcoded demo strings | `results.suggestedNextStep` | `demoData.js`, `AnalysisResults.jsx` |
| `source` | `'demo'` | `'user'` | `demoData.js`, `storage.js:saveSession()` |
| `createdAt` | Hardcoded ISO 8601 | `new Date().toISOString()` | `demoData.js`, `AnalysisResults.jsx` |
| `duration` | Hardcoded display string | `results.durationFormatted` | `demoData.js`, `AnalysisResults.jsx` |
| `instrument` | Hardcoded per session | `'Recorded Audio'` (generic) | `demoData.js`, `AnalysisResults.jsx` |
| `focus` | Hardcoded per session | `'Acoustic Energy & Stability'` (generic) | `demoData.js`, `AnalysisResults.jsx` |

---

## 2. Current Analysis Result Schema

The analysis result object is defined by `demoAnalysisResult` in `src/data/demoData.js`. This is the **only** analysis shape the frontend currently knows how to render. It is passed directly to `AnalysisResults.jsx` and `MetricBreakdown.jsx`.

```js
{
  overallScore:      number   // 86 (composite 0–100)
  accuracy:          number   // 88 (heuristic signal envelope match)
  stability:         number   // 84 (energy/amplitude steadiness)
  consistency:       number   // 87 (phrase dynamic continuity)
  durationFormatted: string   // '3m 42s'
  signalEnergy:      string   // 'Steady acoustic energy' (display-only description)
  dynamicRange:      string   // 'Balanced (-18 dB to -6 dB)' (display-only description)
  feedbackSummary:   string   // multi-sentence observation paragraph
  suggestedNextStep: string   // single actionable practice prompt
  focusPoints:       string[] // array of 3 observed focus points
}
```

**How this flows through the analysis workflow:**

```
Analyse.jsx (READY state)
  → user selects file → AudioDropzone validates via audioConfig.js
  → handleStartAnalysis() → ANALYSING state
  → AnalysisProgress.jsx (2.1s simulated timer)
  → onComplete() → RESULTS state
  → AnalysisResults.jsx renders with results={demoAnalysisResult}
     → MetricBreakdown.jsx reads overallScore, accuracy, stability, consistency
     → AnalysisResults.jsx reads feedbackSummary, focusPoints, signalEnergy, dynamicRange,
       durationFormatted, suggestedNextStep
     → handleSaveSession() maps these fields into the canonical session schema
        → storage.saveSession() normalizes and persists to localStorage
```

**Critical observation:** The analysis result is **always `demoAnalysisResult`**. The `Analyse.jsx` page never processes the actual audio file — the workflow state machine is purely a UI demonstration. The file is selected, validated, then discarded; `demoAnalysisResult` is hardcoded as the result regardless of the file.

---

## 3. Current Storage Flow

### 3.1 localStorage Keys

| Key | Contents | Shape |
|-----|----------|-------|
| `riazai_sessions` | Array of session objects | `Session[]` (canonical schema above) |
| `riazai_last_analysis` | Last analysis result | `AnalysisResult` (section 2 schema) |

### 3.2 Storage Functions (`src/utils/storage.js`)

```
getStoredSessions()
  ├─ localStorage.getItem('riazai_sessions')
  ├─ null → return recentSessions (demoData.js) — FIRST LOAD
  ├─ '[]' → return [] — USER CLEARED SESSIONS
  └─ JSON.parse → map(normalizeSession) → filter(Boolean)

saveSession(newSession)
  ├─ getStoredSessions() → current
  ├─ normalizeSession({ id: 'sess-<timestamp>', source: 'user', ...newSession })
  ├─ filter duplicates by id
  └─ localStorage.setItem('riazai_sessions', [newSession, ...current])

deleteSession(sessionId)
  ├─ getStoredSessions() → current
  ├─ filter out matching id
  └─ localStorage.setItem('riazai_sessions', updated)

resetToDemoSessions()
  └─ localStorage.setItem('riazai_sessions', recentSessions.map(normalizeSession))

getStoredSessionById(id)
  └─ getStoredSessions().find(s => s.id === id)

getStoredAnalysis()
  ├─ localStorage.getItem('riazai_last_analysis')
  ├─ null → return demoAnalysisResult
  └─ JSON.parse → return result

saveAnalysisResult(result)
  └─ localStorage.setItem('riazai_last_analysis', result)
```

### 3.3 In-Memory Fallback

Both `memorySessions` and `memoryAnalysis` variables serve as fallbacks when `localStorage` throws (e.g., disabled, quota exceeded, private browsing in some browsers). All write operations update both `localStorage` and the in-memory variable.

### 3.4 Normalization (`normalizeSession`)

Called on every read. Fills missing fields with safe defaults. This is a defensive measure — older stored sessions may lack fields added in later milestones. Any future schema extension **must** add a default case here.

---

## 4. Current Data Flow by Page

### 4.1 Dashboard (`/dashboard` → `src/pages/Dashboard.jsx`)

```
Data Sources:
  ├─ dashboardMetrics (demoData.js)  → 4 MetricCard components (hardcoded)
  ├─ practiceOverview (demoData.js)  → PracticeOverview component (hardcoded)
  ├─ progressData (demoData.js)      → ProgressTrend component (hardcoded SVG chart)
  ├─ focusArea (demoData.js)         → FocusAreaCard component (hardcoded)
  └─ getStoredSessions() (storage.js) → Dashboard SessionCard components (dynamic, first 4)

Observation: The 4 overview metric cards are entirely hardcoded from demoData.js,
not derived from stored sessions. Only the "Recent Sessions" list reads from storage.
```

### 4.2 Analyse (`/analyse` → `src/pages/Analyse.jsx`)

```
Data Sources:
  └─ demoAnalysisResult (demoData.js) → AnalysisResults.jsx (always the same result)

Output:
  └─ handleSaveSession() in AnalysisResults.jsx → storage.saveSession()
     Maps: overallScore→score, accuracy, stability, consistency,
           feedbackSummary→feedback, suggestedNextStep→nextStep,
           durationFormatted→duration, file.name→title
```

### 4.3 Sessions (`/sessions` → `src/pages/Sessions.jsx`)

```
Data Sources:
  └─ getStoredSessions() (storage.js) → session list

Read Functions Used:
  ├─ calculateOverview(sessions) → summary banner (total, time, avg score, avg consistency)
  └─ getUniqueInstruments(sessions) → instrument filter dropdown

Write Operations:
  ├─ deleteSession(id) → storage.deleteSession() → re-renders list
  └─ resetToDemoSessions() → storage.resetToDemoSessions() → re-renders list

Derived State (useMemo):
  ├─ instruments → getUniqueInstruments(sessions)
  ├─ overview → calculateOverview(sessions)
  └─ filteredSessions → search + instrument + source + sort filters applied
```

### 4.4 Analytics (`/analytics` → `src/pages/Analytics.jsx`)

```
Data Sources:
  └─ getStoredSessions() (storage.js) → all analytics derived from this array

Derivation Functions (all in analyticsCalculations.js):
  ├─ calculateOverview(sessions)        → Section A: 4 overview metric cards
  ├─ calculateProgressTrend(sessions)    → Section B: ProgressChart SVG
  ├─ calculatePracticeFrequency(sessions) → Section C: PracticeFrequencyChart SVG
  ├─ calculatePerformanceBreakdown(sessions) → Section D: MetricTrend bars
  ├─ calculateHighlights(sessions)       → Section E: strongest, longest, scoreDelta
  └─ getFocusTags(sessions)              → Section F: focus area tag chips

Observation: Analytics is the only page with 100% derived data from stored sessions.
No hardcoded metric values are used.
```

---

## 5. Insertion Points for Future Real Analysis

This section identifies every location in the frontend where a real analysis result would need to be injected instead of the current `demoAnalysisResult`.

### 5.1 Primary Analysis Insertion Point

**File:** `src/pages/Analyse.jsx`  
**Line:** `results={demoAnalysisResult}` (inside RESULTS state rendering)  
**Current behavior:** Always renders `demoAnalysisResult` from `demoData.js`  
**Future change:** Replace with actual API response after Spring Boot backend analysis completes

This is the **single point of truth** for analysis results entering the frontend. All downstream components (`AnalysisResults`, `MetricBreakdown`, `SessionDetailModal`) consume whatever is passed here.

### 5.2 Session Save Mapping Point

**File:** `src/components/analysis/AnalysisResults.jsx`  
**Function:** `handleSaveSession()`  
**Current behavior:** Maps `results.*` fields to canonical session schema  
**Future change:** May need to map additional fields from a richer API response (e.g., `pitchContour`, `noteDetection`, `rhythmMetrics`)

### 5.3 Analysis Progress Simulation Point

**File:** `src/components/analysis/AnalysisProgress.jsx`  
**Current behavior:** 2.1s hardcoded timer with staged messages  
**Future change:** Replace with real progress tracking (e.g., WebSocket progress events, polling, or chunked upload status)

### 5.4 Analysis Storage Fallback Point

**File:** `src/utils/storage.js`  
**Function:** `getStoredAnalysis()`  
**Current behavior:** Returns `demoAnalysisResult` when no stored result exists  
**Future change:** May be replaced by server-side session storage or a real API cache

### 5.5 Dashboard Hardcoded Metrics Point

**File:** `src/pages/Dashboard.jsx`  
**Lines:** All `dashboardMetrics.*` references  
**Current behavior:** 4 metric cards use hardcoded demoData values  
**Future change:** Derive from `getStoredSessions()` or a dedicated dashboard API endpoint

### 5.6 Dashboard Hardcoded Progress Trend Point

**File:** `src/components/dashboard/ProgressTrend.jsx`  
**Current behavior:** Renders from `progressData` (hardcoded 6-point array from demoData.js)  
**Future change:** Replace with derived data from `calculateProgressTrend(getStoredSessions())`

### 5.7 Dashboard Focus Area Point

**File:** `src/components/dashboard/FocusAreaCard.jsx`  
**Current behavior:** Renders a single hardcoded focus area from `demoData.focusArea`  
**Future change:** Derive from analysis results or a recommendation engine

### 5.8 Session Detail Analysis Metadata Point

**File:** `src/components/analysis/AnalysisResults.jsx`  
**Lines:** `results.signalEnergy`, `results.dynamicRange`, `results.durationFormatted`  
**Current behavior:** Displayed as "Session Take Details" in the results card  
**Future change:** Richer acoustic metadata from real analysis (SNR, spectral centroid, fundamental frequency range, etc.)

---

## 6. Prototype-Only Terminology Inventory

The following terms appear in the frontend UI and should be **retained only while the prototype heuristic engine is active**. When real analysis is introduced, each must be replaced or contextualised.

### 6.1 Metric Labels (currently heuristic-derived)

| Current Label | File(s) | Component | Recommended Future Replacement |
|---------------|---------|-----------|-------------------------------|
| `Performance Score` | `demoData.js`, `MetricBreakdown.jsx` | MetricCard, MetricBreakdown | `Composite Score` or `Overall Rating` (with methodology disclosure) |
| `Accuracy` | `demoData.js`, `MetricBreakdown.jsx`, `SessionDetailModal.jsx` | MetricBreakdown, SessionDetailModal | `Intonation Accuracy` or `Note Accuracy` (if pitch detection is added) |
| `Stability` | `demoData.js`, `MetricBreakdown.jsx`, `SessionDetailModal.jsx` | MetricBreakdown, SessionDetailModal | `Tonal Stability` or `Signal Stability` (methodology-dependent) |
| `Consistency` | `demoData.js`, `MetricBreakdown.jsx`, `SessionDetailModal.jsx` | MetricBreakdown, SessionDetailModal | `Rhythmic Consistency` or `Phrase Consistency` (scope-dependent) |
| `Session Consistency` | `demoData.js` | Dashboard MetricCard | Derive from longitudinal data, not single-session heuristic |
| `Prototype consistency benchmark` | `demoData.js` | Dashboard MetricCard caption | Remove — replace with methodology-specific caption |

### 6.2 Heuristic / Prototype Disclaimers

| Text String | File(s) | Component | Action When Real Analysis Ships |
|-------------|---------|-----------|-------------------------------|
| `Prototype Engine` | `Analyse.jsx`, `AnalysisResults.jsx` | Badge components | Remove or replace with engine version identifier |
| `Demonstration analysis` | `AnalysisResults.jsx` | Banner | Remove — replace with analysis engine identifier |
| `Simulated heuristic metrics based on raw audio-byte amplitude` | `AnalysisResults.jsx` | Banner subtitle | Replace with actual methodology description |
| `Frontend Demonstration • Simulated Analysis Delay` | `AnalysisProgress.jsx` | Chip badge | Remove entirely — replace with real progress tracking |
| `Heuristic signal envelope match` | `MetricBreakdown.jsx` | Metric subtitle | Replace with actual signal processing description |
| `Energy & amplitude steadiness` | `MetricBreakdown.jsx` | Metric subtitle | Replace with actual metric description |
| `Phrase dynamic continuity` | `MetricBreakdown.jsx` | Metric subtitle | Replace with actual metric description |
| `Prototype metric` | `SessionDetailModal.jsx`, `MetricTrend.jsx` | Subtitle badges | Remove — these become real metrics |
| `Prototype performance avg` | `Analytics.jsx` | Overview card caption | Remove |
| `Prototype consistency avg` | `Analytics.jsx` | Overview card caption | Remove |
| `Prototype metrics are for demonstration purposes` | `Analytics.jsx` | Footer notice | Remove |
| `Heuristic audio-byte amplitude analysis` | `CapabilitiesSection.jsx` | Landing page | Update to reflect actual analysis capabilities |
| `Heuristic Audio Engine` | `AppLayout.jsx`, `Footer.jsx` | Layout footer, landing footer | Replace with engine name/version |
| `Prototype Mode` | `Dashboard.jsx` | Header badge | Remove when analysis is real |
| `RiazAI Prototype` | `MobileNavigation.jsx` | Mobile nav footer | Remove or replace with version identifier |
| `Local Prototype` | `Sidebar.jsx` | Desktop sidebar footer | Remove or replace |
| `Prototype alerts` | `Topbar.jsx` | Notification dropdown | Replace with real alert system |
| `Interactive product preview — Demonstration data` | `DashboardPreview.jsx` | Landing page | Keep during prototype; remove when product is live |
| `Illustrative recommendation` / `Demonstration insight` | `FocusAreaCard.jsx`, `demoData.js` | Dashboard focus area | Replace with real recommendations from analysis |
| `Not based on automated weakness detection` | `FocusAreaCard.jsx` | Disclaimer | Remove when actual analysis drives recommendations |
| `v0.2 Prototype` / `Local Prototype v0.2` | `Hero.jsx`, `CTASection.jsx` | Landing page | Update version number |

### 6.3 Analysis-Specific Fallback Strings

These appear when analysis fields are missing or fall back to defaults:

| Current Fallback | File | Context |
|------------------|------|---------|
| `'Steady'` (consistencyLabel default) | `storage.js:normalizeSession()` | Will need data-driven label mapping |
| `'Recorded Audio'` (instrument default) | `AnalysisResults.jsx` | Should be user-selected or file-metadata-derived |
| `'Acoustic Energy & Stability'` (focus default) | `AnalysisResults.jsx` | Should be analysis-derived |
| `'3m 42s'` (duration fallback) | `AnalysisResults.jsx`, `AnalysisProgress.jsx` | Should always come from actual file duration |
| `'Steady'` (signalEnergy fallback) | `AnalysisResults.jsx` | Should come from analysis response |
| `'Balanced'` (dynamicRange fallback) | `AnalysisResults.jsx` | Should come from analysis response |

---

## 7. Recommended API Response Shape for Spring Integration

When the Spring Boot backend analysis endpoint is ready, the frontend should expect this response shape. This is designed to map cleanly onto the existing `AnalysisResults.jsx` consumption pattern while providing room for future acoustic analysis fields.

### 7.1 Analysis Response (POST `/api/analysis`)

```typescript
interface AnalysisResponse {
  // --- Core Identifiers ---
  analysisId: string;           // Unique analysis run ID
  sessionId: string;            // Associated session ID (created on save)
  engineVersion: string;        // e.g. 'heuristic-v1', 'acoustic-v1', 'pitch-v1'

  // --- Derived Metrics (0–100 scale) ---
  metrics: {
    overallScore: number;       // Composite score (algorithm-dependent)
    accuracy: number;           // Methodology-dependent accuracy metric
    stability: number;          // Methodology-dependent stability metric
    consistency: number;        // Methodology-dependent consistency metric
    consistencyLabel: 'High' | 'Steady' | 'Moderate';
  };

  // --- Audio Metadata (from file inspection) ---
  audio: {
    durationSeconds: number;    // Actual file duration
    durationFormatted: string;  // '3m 42s'
    sampleRate: number;         // e.g. 44100
    format: string;             // e.g. 'WAV', 'MP3'
    peakAmplitude: number;      // Normalised 0–1
    rmsLevel: number;           // Normalised 0–1
    signalEnergy: string;       // 'Steady' | 'Variable' | 'Declining'
    dynamicRange: string;       // Human-readable, e.g. 'Balanced (-18 dB to -6 dB)'
  };

  // --- Pedagogical Output ---
  feedback: {
    summary: string;            // Multi-sentence observation paragraph
    focusPoints: string[];      // Array of 2–5 observed focus points
    suggestedNextStep: string;  // Single actionable practice prompt
  };

  // --- Optional: Real Analysis Extensions (future) ---
  // pitch?: PitchAnalysis;    // F0 contour, intonation accuracy
  // rhythm?: RhythmAnalysis;  // Tempo stability, onset precision
  // spectral?: SpectralData;  // Centroid, bandwidth, harmonic ratios
  // notes?: NoteDetection[];  // Detected notes with pitch, onset, offset
}
```

### 7.2 Frontend-to-Session Mapping

When saving from the API response to the canonical session schema:

```typescript
function mapAnalysisToSession(response: AnalysisResponse, file: File): Session {
  return {
    // Identity
    id: `sess-${Date.now()}`,
    source: 'user',
    createdAt: new Date().toISOString(),
    date: 'Just now',
    status: 'Completed',

    // User context (should come from user input or metadata)
    title: `Riaz Take — ${file.name.replace(/\.[^/.]+$/, '')}`,
    instrument: 'Recorded Audio',   // TODO: user selects instrument before analysis
    focus: 'General Practice',      // TODO: user selects or analysis derives

    // Timing
    duration: response.audio.durationFormatted,
    durationMinutes: Math.ceil(response.audio.durationSeconds / 60),

    // Analysis metrics
    score: response.metrics.overallScore,
    accuracy: response.metrics.accuracy,
    stability: response.metrics.stability,
    consistency: response.metrics.consistency,
    consistencyLabel: response.metrics.consistencyLabel,

    // Pedagogical
    feedback: response.feedback.summary,
    nextStep: response.feedback.suggestedNextStep,

    // Future extensions would store additional fields here
  };
}
```

### 7.3 Analysis Display Mapping

When passing to `AnalysisResults.jsx`, the response maps to the existing props interface:

```typescript
function mapResponseToProps(response: AnalysisResponse) {
  return {
    overallScore: response.metrics.overallScore,
    accuracy: response.metrics.accuracy,
    stability: response.metrics.stability,
    consistency: response.metrics.consistency,
    durationFormatted: response.audio.durationFormatted,
    signalEnergy: response.audio.signalEnergy,
    dynamicRange: response.audio.dynamicRange,
    feedbackSummary: response.feedback.summary,
    suggestedNextStep: response.feedback.suggestedNextStep,
    focusPoints: response.feedback.focusPoints,
    // New fields for future extension:
    engineVersion: response.engineVersion,
    // pitch: response.pitch,
    // rhythm: response.rhythm,
  };
}
```

---

## 8. Recommended Layered Separation

The analysis pipeline should be decomposed into four distinct layers. Each layer has a clear input/output contract and can be developed and tested independently.

### Layer 1: Raw Audio Analysis

**Responsibility:** Ingest audio bytes, compute acoustic features, produce raw signal measurements.  
**Owner:** Spring Boot backend (`AudioAnalysisService.java`)  
**Input:** Audio file (binary)  
**Output:** Raw acoustic features (not yet pedagogically interpretable)

```
Raw Audio Features (internal to backend):
  ├─ Waveform amplitude envelope
  ├─ RMS energy per frame
  ├─ Spectral centroid per frame
  ├─ Spectral bandwidth per frame
  ├─ Zero-crossing rate
  ├─ Onset detection (note onset timestamps)
  ├─ Silence detection (speech/music/silence segmentation)
  ├─ Peak amplitude / dynamic range
  ├─ Fundamental frequency (F0) estimation (future)
  └─ Harmonic-to-noise ratio (future)
```

**Frontend impact:** None directly. The frontend never sees raw features — it receives the output of Layer 2 or Layer 3.

**Current prototype gap:** The frontend bypasses this layer entirely. `demoAnalysisResult` is hardcoded.

### Layer 2: Derived Metrics

**Responsibility:** Transform raw acoustic features into interpretable, bounded metric scores.  
**Owner:** Backend service or analysis engine  
**Input:** Raw audio features (Layer 1)  
**Output:** Metric scores on a 0–100 scale with methodology metadata

```
Derived Metrics:
  ├─ overallScore (composite)
  ├─ accuracy (intonation/note accuracy — methodology-dependent)
  ├─ stability (tonal/signal stability — methodology-dependent)
  ├─ consistency (phrase/rhythmic consistency — methodology-dependent)
  ├─ consistencyLabel (High/Steady/Moderate — derived from consistency score)
  └─ engineVersion (which algorithm produced these metrics)
```

**Frontend impact:** `AnalysisResults.jsx` and `MetricBreakdown.jsx` render these values. `storage.js:normalizeSession()` stores them in the session schema. `analyticsCalculations.js` aggregates them across sessions.

**Critical design principle:** Metrics must be **bounded (0–100)**, **algorithm-versioned** (`engineVersion`), and **methodology-documented** so that:
- Users can compare sessions analysed by the same engine version
- Cross-engine comparisons carry appropriate disclaimers
- The frontend can display methodology-specific labels

### Layer 3: Pedagogical Feedback

**Responsibility:** Generate human-readable practice guidance from derived metrics.  
**Owner:** Backend recommendation engine or rule-based system  
**Input:** Derived metrics (Layer 2) + user context (instrument, skill level, session history)  
**Output:** Textual feedback for display

```
Pedagogical Output:
  ├─ feedbackSummary (multi-sentence observation)
  ├─ focusPoints (2–5 actionable observations)
  ├─ suggestedNextStep (single practice prompt)
  └─ (future) personalisedExercises, repertoireSuggestions
```

**Frontend impact:** Rendered in `AnalysisResults.jsx` (feedback summary, focus points, next step) and `SessionDetailModal.jsx` (feedback, next step). Stored in session schema as `feedback` and `nextStep`.

**Critical design principle:** Feedback must be **explicitly labelled as generated** (not human expert opinion) and **methodology-specific** (a pitch detection engine produces different feedback than an amplitude stability engine).

### Layer 4: Longitudinal Analytics

**Responsibility:** Aggregate session-level metrics into progress trends, patterns, and long-term insights.  
**Owner:** Frontend `analyticsCalculations.js` (local aggregation) + Backend analytics API (future)  
**Input:** Array of stored sessions  
**Output:** Aggregated trends, streaks, progress deltas, focus area patterns

```
Longitudinal Analytics (frontend, currently in analyticsCalculations.js):
  ├─ calculateOverview() → total sessions, total time, average score
  ├─ calculatePerformanceBreakdown() → average accuracy/stability/consistency
  ├─ calculateHighlights() → strongest session, longest session, score delta
  ├─ calculateProgressTrend() → chronological score/consistency data points
  ├─ calculatePracticeFrequency() → minutes per session
  ├─ getFocusTags() → unique focus areas across sessions
  └─ (future) streak calculation, plateau detection, improvement rate

Longitudinal Analytics (future backend):
  ├─ Cross-user anonymised benchmarks
  ├─ Instrument-specific baselines
  ├─ Practice habit pattern recognition
  └─ Milestone achievement detection
```

**Frontend impact:** All `Analytics.jsx` sections (A through F) and the Dashboard's recent sessions list.

### Layer Boundary Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│  │ Audio    │   │ Analysis │   │ Sessions │               │
│  │ Dropzone │──▶│ Progress │──▶│  Page    │               │
│  │ (select) │   │ (timer)  │   │  (CRUD)  │               │
│  └──────────┘   └──────────┘   └──────────┘               │
│                        │              │                     │
│                   ┌────▼────┐    ┌────▼────┐               │
│                   │Analysis │    │analytics│               │
│                   │Results  │    │Calcula- │               │
│                   │(render) │    │tions.js │               │
│                   └─────────┘    └─────────┘               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Layer 4: Longitudinal Analytics (frontend)           │   │
│  │ analyticsCalculations.js — pure aggregation          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                     ┌────────▼────────┐
                     │   localStorage  │
                     │  (riazai_* key) │
                     └────────┬────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                  BACKEND (Spring Boot)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Layer 1: Raw Audio Analysis                         │   │
│  │ AudioAnalysisService.java — waveform, amplitude,    │   │
│  │ energy, onset detection (future: F0, harmonics)     │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │ Layer 2: Derived Metrics                            │   │
│  │ Score computation, metric bounding, engine versioning│   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐   │
│  │ Layer 3: Pedagogical Feedback                       │   │
│  │ Rule-based or ML-generated practice guidance         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Frontend Components Requiring Modification for Real Analysis

This is an exhaustive list of every component that will need changes when `demoAnalysisResult` is replaced by a real API response.

### 9.1 Must Change (analysis data consumers)

| Component | File | What Changes | Why |
|-----------|------|-------------|-----|
| `Analyse` | `src/pages/Analyse.jsx` | Replace `demoAnalysisResult` with API call; add loading/error states; pass real response to Results | Single insertion point for all analysis data |
| `AnalysisResults` | `src/components/analysis/AnalysisResults.jsx` | Remove "Demonstration analysis" banner; update `handleSaveSession()` field mapping; add new metric fields if richer API | Primary analysis display; save mapping |
| `MetricBreakdown` | `src/components/analysis/MetricBreakdown.jsx` | Update subtitle labels from heuristic descriptions to real methodology; conditionally show additional metrics | Displays per-metric cards |
| `AnalysisProgress` | `src/components/analysis/AnalysisProgress.jsx` | Replace 2.1s timer with real progress tracking; update staged messages; remove "Simulated Analysis Delay" chip | Currently pure simulation |
| `SelectedFile` | `src/components/analysis/SelectedFile.jsx` | Remove "heuristic practice analysis" text; update "No audio data leaves your device" if server-side analysis is added | Pre-analysis file display |

### 9.2 Should Change (display accuracy updates)

| Component | File | What Changes | Why |
|-----------|------|-------------|-----|
| `SessionDetailModal` | `src/components/sessions/SessionDetailModal.jsx` | Remove "Prototype metric" subtitles from Accuracy/Stability/Consistency; update "Prototype Feedback Summary" heading; remove amber demo banner | Displays saved session details |
| `SessionListCard` | `src/components/sessions/SessionListCard.jsx` | Potentially no change needed — already reads from canonical session schema | Data flows through `sessions` prop |
| `MetricTrend` | `src/components/analytics/MetricTrend.jsx` | Remove "Prototype metric" subtitles; remove "prototype metrics for demonstration purposes" footer | Displays aggregated metric bars |
| `Dashboard SessionCard` | `src/components/dashboard/SessionCard.jsx` | Remove "Demo Score" label — should say "Score" or show engine version | Displays session cards on dashboard |

### 9.3 Should Change (hardcoded data replacement)

| Component | File | What Changes | Why |
|-----------|------|-------------|-----|
| `Dashboard` | `src/pages/Dashboard.jsx` | Replace `dashboardMetrics` hardcoded values with derived values from `getStoredSessions()` | 4 overview metric cards are entirely hardcoded |
| `ProgressTrend` (Dashboard) | `src/components/dashboard/ProgressTrend.jsx` | Replace `progressData` (hardcoded) with `calculateProgressTrend(getStoredSessions())` | SVG chart shows hardcoded 6-point trend |
| `FocusAreaCard` | `src/components/dashboard/FocusAreaCard.jsx` | Derive from analysis results instead of hardcoded `demoData.focusArea` | Currently shows a single hardcoded recommendation |
| `QuickActions` | `src/components/dashboard/QuickActions.jsx` | No data change, but may need route updates if analysis flow changes | Navigation links only |

### 9.4 Must Change (landing page accuracy)

| Component | File | What Changes | Why |
|-----------|------|-------------|-----|
| `Hero` | `src/components/landing/Hero.jsx` | Update "Heuristic audio engine" badge; update "v0.2 Prototype" version; update demonstration metrics panel | Landing page hero |
| `CapabilitiesSection` | `src/components/landing/CapabilitiesSection.jsx` | Update "Prototype Active" badge; update "Heuristic audio-byte amplitude analysis" status; update comparison table | Product capabilities description |
| `HowItWorks` | `src/components/landing/HowItWorks.jsx` | Update Step 2 description: "The heuristic engine computes..." | How-it-works description |
| `DashboardPreview` | `src/components/landing/DashboardPreview.jsx` | Update demonstration data labels if dashboard metrics change | Landing page product preview |
| `InsightSection` | `src/components/landing/InsightSection.jsx` | Update "heuristic energy stability metrics" text | Long-term value proposition |
| `Footer` | `src/components/landing/Footer.jsx` | Update "Heuristic Audio Engine" text; update "Milestone 3 Active" | Landing page footer |

### 9.5 Must Change (layout / chrome)

| Component | File | What Changes | Why |
|-----------|------|-------------|-----|
| `AppLayout` | `src/components/layout/AppLayout.jsx` | Update "Demonstration UI & Heuristic Audio Engine" footer text | Global app footer |
| `Sidebar` | `src/components/navigation/Sidebar.jsx` | Update "Local Prototype" status text | Desktop sidebar footer |
| `MobileNavigation` | `src/components/navigation/MobileNavigation.jsx` | Update "RiazAI Prototype" text | Mobile drawer footer |
| `Topbar` | `src/components/navigation/Topbar.jsx` | Update "Prototype alerts" notification text | Notification dropdown |

### 9.6 May Change (storage layer)

| Module | File | What Changes | Why |
|--------|------|-------------|-----|
| `storage.js` | `src/utils/storage.js` | Add `normalizeSession` cases for new fields; potentially replace localStorage with server-side session storage; update `getStoredAnalysis` to fetch from API | Schema evolution, persistence model |
| `analyticsCalculations.js` | `src/utils/analyticsCalculations.js` | Add new aggregation functions for new metric types; potentially add streak calculation, plateau detection | Analytics derivation |
| `demoData.js` | `src/data/demoData.js` | Either update demo session data to reflect new schema, or remove demo sessions entirely | Demo data becomes stale |

### 9.7 Must Change (test updates)

| Module | File | What Changes | Why |
|--------|------|-------------|-----|
| `App.test.js` | `src/App.test.js` | Update all prototype-related text assertions; add tests for real API analysis flow; test loading/error states | Tests assert on current prototype strings |

### 9.8 Modification Priority Order

When real analysis ships, the recommended order of component modifications is:

1. **Analyse.jsx** — wire up real API call (the insertion point)
2. **AnalysisResults.jsx + MetricBreakdown.jsx** — update rendering for real response shape
3. **AnalysisProgress.jsx** — replace simulation with real progress
4. **storage.js** — extend normalizeSession for new fields
5. **Analytics.jsx + analyticsCalculations.js** — ensure new fields aggregate correctly
6. **Sessions.jsx + SessionDetailModal.jsx** — update session display
7. **Dashboard.jsx + MetricCard/ProgressTrend/FocusAreaCard** — replace hardcoded demo data
8. **All landing page components** — update terminology and disclaimers
9. **Layout chrome (Sidebar, Topbar, MobileNav, AppLayout)** — remove prototype labels
10. **App.test.js** — update all text assertions

---

## 10. Schema Extension Considerations

### 10.1 Fields That May Be Added to the Session Schema

When richer analysis becomes available, the canonical session schema should be extended (not replaced) with:

```js
{
  // ... existing canonical fields ...

  // Engine metadata
  engineVersion:     string   // 'heuristic-v1' | 'acoustic-v1' | 'pitch-v1'
  engineName:        string   // 'Heuristic Stability Engine' | 'Pitch Analysis Engine'

  // Extended audio metadata
  sampleRate:        number   // Hz
  bitDepth:          number   // e.g. 16, 24
  peakAmplitude:     number   // 0–1 normalised
  rmsLevel:          number   // 0–1 normalised
  snrEstimate:       number   // dB (signal-to-noise ratio)

  // Pitch analysis (future)
  pitchContourAvailable: boolean
  averageF0:         number   // Hz
  f0Range:           [number, number]  // [min, max] Hz
  intonationAccuracy: number  // 0–100

  // Rhythm analysis (future)
  estimatedBPM:      number
  tempoStability:    number   // 0–100
  onsetPrecision:    number   // 0–100

  // Spectral analysis (future)
  spectralCentroid:  number   // Hz average
  harmonicRatio:     number   // harmonic-to-noise ratio
}
```

### 10.2 Backward Compatibility Rules

1. **All new fields must be optional** in `normalizeSession()`. Existing stored sessions without new fields must continue to render correctly.
2. **The `score`, `accuracy`, `stability`, `consistency` fields must retain their 0–100 scale** to preserve analytics aggregation correctness.
3. **The `engineVersion` field must be present** whenever real analysis produces metrics — this enables the frontend to display appropriate methodology labels and prevents misleading cross-engine comparisons.
4. **`source: 'demo'` sessions must continue to work** alongside `source: 'user'` sessions from different engine versions. The analytics page should handle mixed-version aggregation gracefully (with a disclaimer).

### 10.3 Migration Strategy

When real analysis ships:
1. **Do not clear existing localStorage data.** Old sessions with heuristic metrics remain valid as a historical record.
2. **Add `engineVersion: 'heuristic-v1'` to all demo sessions** in `demoData.js` so the system can distinguish them from real analysis sessions.
3. **Update `normalizeSession()`** to default `engineVersion` to `'heuristic-v1'` when absent (backward compatibility).
4. **Add engine-version-aware labels** to the Sessions page and Analytics page so users understand which sessions were analysed by which engine.

---

## Appendix A: File Reference Index

| File | Role in Analysis Pipeline |
|------|--------------------------|
| `src/data/demoData.js` | Hardcoded analysis result (`demoAnalysisResult`), demo sessions, dashboard metrics |
| `src/utils/storage.js` | localStorage CRUD, session normalization, analysis storage |
| `src/utils/analyticsCalculations.js` | Pure aggregation from session arrays |
| `src/config/audioConfig.js` | File validation contract (10 MB, accepted formats) |
| `src/pages/Analyse.jsx` | Analysis workflow state machine; `demoAnalysisResult` insertion point |
| `src/pages/Sessions.jsx` | Session list with search/filter/sort; CRUD operations |
| `src/pages/Analytics.jsx` | Derived analytics display; all values from stored sessions |
| `src/pages/Dashboard.jsx` | Mixed: hardcoded metrics + dynamic session list |
| `src/components/analysis/AudioDropzone.jsx` | File selection + validation |
| `src/components/analysis/SelectedFile.jsx` | Pre-analysis file display |
| `src/components/analysis/AnalysisProgress.jsx` | Simulated analysis progress |
| `src/components/analysis/AnalysisResults.jsx` | Results display + save-to-session mapping |
| `src/components/analysis/MetricBreakdown.jsx` | 4-metric card grid |
| `src/components/sessions/SessionListCard.jsx` | Session card for list view |
| `src/components/sessions/SessionDetailModal.jsx` | Modal detail view |
| `src/components/analytics/ProgressChart.jsx` | SVG trend chart |
| `src/components/analytics/PracticeFrequencyChart.jsx` | SVG bar chart |
| `src/components/analytics/MetricTrend.jsx` | Metric comparison bars |
| `src/components/dashboard/MetricCard.jsx` | Generic metric card |
| `src/components/dashboard/SessionCard.jsx` | Dashboard session card |
| `src/components/dashboard/ProgressTrend.jsx` | Dashboard SVG trend (hardcoded data) |
| `src/components/dashboard/FocusAreaCard.jsx` | Hardcoded focus area |
| `src/components/layout/AppLayout.jsx` | Global footer with prototype text |
| `src/components/navigation/Sidebar.jsx` | Desktop sidebar with prototype status |
| `src/components/navigation/Topbar.jsx` | Top header with prototype alerts |
| `src/components/navigation/MobileNavigation.jsx` | Mobile drawer with prototype text |
| `src/components/landing/Hero.jsx` | Landing hero with heuristic references |
| `src/components/landing/CapabilitiesSection.jsx` | Landing capabilities with heuristic vs roadmap |
| `src/components/landing/DashboardPreview.jsx` | Landing product preview |
| `src/components/landing/HowItWorks.jsx` | Landing how-it-works |
| `src/components/landing/Footer.jsx` | Landing footer with engine text |
| `src/components/landing/CTASection.jsx` | Landing CTA with prototype version |
| `src/components/landing/InsightSection.jsx` | Landing insight with heuristic text |
| `src/App.test.js` | All 20 tests asserting on prototype strings |
