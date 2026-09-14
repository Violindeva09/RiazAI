# RiazAI V2 — Analysis Decision Framework

**Status:** Technical Decision Framework  
**Date:** 2026-09-13  
**Scope:** Evaluates candidate audio-analysis capabilities for the first real implementation in RiazAI.  
**Nature:** This is a decision-support document. It does not contain research findings, experimental results, or implementation decisions. It is a structured framework for evaluating findings that will be gathered later.

**Principle:** No capability is chosen here. This document exists to make the eventual choice rigorous, transparent, and architecture-aligned.

---

## 1. Current Prototype Analysis Boundary

The existing RiazAI frontend operates in **demonstration mode**. The analysis workflow is a UI state machine that accepts an audio file, validates it, runs a simulated 2.1-second timer, and then renders a hardcoded result object (`demoAnalysisResult`). No audio data is processed.

### What the frontend currently renders

| Metric | Current Meaning | Scale | Source |
|--------|----------------|-------|--------|
| `overallScore` | Hardcoded composite | 0–100 | `demoData.js` |
| `accuracy` | "Heuristic signal envelope match" | 0–100 | `demoData.js` |
| `stability` | "Energy & amplitude steadiness" | 0–100 | `demoData.js` |
| `consistency` | "Phrase dynamic continuity" | 0–100 | `demoData.js` |
| `signalEnergy` | Display string ("Steady acoustic energy") | Text | `demoData.js` |
| `dynamicRange` | Display string ("Balanced (-18 dB to -6 dB)") | Text | `demoData.js` |
| `feedbackSummary` | Multi-sentence observation | Text | `demoData.js` |
| `suggestedNextStep` | Single practice prompt | Text | `demoData.js` |
| `focusPoints` | Array of 3 observations | Text[] | `demoData.js` |

### What the frontend does NOT do

- Read audio samples, FFT frames, or waveform data
- Compute any acoustic feature (F0, onset, spectral, rhythm)
- Communicate with any backend analysis service
- Differentiate between user-saved and demo sessions in terms of metric meaning
- Track analysis engine version or methodology

### Architectural boundary

The frontend is **analysis-agnostic by design**. It renders whatever the `results` prop contains in `AnalysisResults.jsx`. This means any real analysis capability can be integrated by changing a single insertion point in `Analyse.jsx` and mapping the API response to the existing props interface. The downstream rendering components (`MetricBreakdown`, `SessionDetailModal`, `Analytics.jsx`) need only schema-compatible data, not algorithmic knowledge.

---

## 2. Existing Frontend Insertion Points

These are the exact locations where real analysis data would enter and flow through the system. Any candidate capability must be expressible through these pathways without architectural changes.

### 2.1 Entry Point

**`Analyse.jsx` line `results={demoAnalysisResult}`** — The single point where analysis results enter the rendering pipeline. A real implementation replaces this with an API response.

### 2.2 Display Pathway

```
API Response
  → mapResponseToProps()     // Shape mapping
  → MetricBreakdown           // 4 metric cards (score, accuracy, stability, consistency)
  → AnalysisResults           // Feedback summary, focus points, next step, file details
  → SessionDetailModal        // Re-display when viewing saved session
```

### 2.3 Persistence Pathway

```
API Response
  → handleSaveSession()      // Map to canonical session schema
  → storage.saveSession()    // Normalize + persist to localStorage
  → analyticsCalculations    // Aggregate across all stored sessions
```

### 2.4 Analytics Pathway

```
localStorage sessions[]
  → calculateOverview()              // Total, time, avg score
  → calculatePerformanceBreakdown()  // Avg accuracy, stability, consistency
  → calculateProgressTrend()         // Score + consistency over time
  → calculateHighlights()            // Strongest, longest, delta
  → calculatePracticeFrequency()     // Minutes per session
```

### 2.5 Extension Surface

The `AnalysisResponse` interface (defined in RIAZAI_V2_ANALYSIS_READINESS.md §7) includes commented extension slots:

```
// pitch?: PitchAnalysis;
// rhythm?: RhythmAnalysis;
// spectral?: SpectralData;
// notes?: NoteDetection[];
```

A candidate capability that produces data expressible within these slots (or analogous ones) can be integrated with minimal schema changes.

### 2.6 Constraints for any candidate

Any chosen capability must:

1. **Produce output expressible as 0–100 bounded scores** (or scores that can be normalised to 0–100) for the existing `MetricBreakdown` display.
2. **Generate human-readable text** suitable for `feedbackSummary`, `focusPoints`, and `suggestedNextStep`.
3. **Complete within a latency budget acceptable for a single-page upload→result workflow** (currently simulated at 2.1 seconds; real target TBD).
4. **Not require client-side audio processing** — the frontend has no Web Audio API integration and no audio analysis libraries; all computation must occur server-side.

---

## 3. Candidate Analysis Dimensions

Ten candidate capabilities are evaluated. Each represents a distinct dimension of music performance analysis that could serve as the first real analysis feature in RiazAI.

### 3.1 Pitch / F0 Estimation

**Definition:** Estimate the fundamental frequency (F0) of monophonic or polyphonic audio over time, producing a pitch contour (time → frequency mapping).

**Relevance to RiazAI:** Indian classical music is built on precise intonation of swaras (notes) relative to a tonic. Pitch accuracy is arguably the most fundamental measure of performance quality for both vocal and melodic instruments.

**Typical approaches:** Autocorrelation (ACF), YIN algorithm, probabilistic YIN, CREPE (neural), pYIN (probabilistic with HMM smoothing), WAV2Vec-based models. Libraries: piptrack (librosa), pyin (librosa), CREPE (tensorflow), BASIC Pitch (Spotify, ML).

### 3.2 Intonation Accuracy

**Definition:** Compare detected pitches against expected or reference pitches (from a score, a raga scale, or a reference recording) and quantify deviation.

**Relevance to RiazAI:** Directly answers "how well did the musician hit the right notes?" This is the most immediately useful metric for Indian classical practice, where microtonal accuracy relative to the shruti system matters.

**Typical approaches:** Requires pitch detection (3.1) as a prerequisite. Then computes cent deviation from nearest target pitch, or measures interval accuracy against a raga scale template.

### 3.3 Rhythm Analysis

**Definition:** Detect the temporal structure of the performance — beat positions, beat strength, metre, and rhythmic patterns.

**Relevance to RiazAI:** Tala (rhythmic cycle) adherence is critical in Indian classical. Rhythm analysis could detect tala alignment, identify rhythmic patterns (thekas), and measure how tightly the musician locks to the beat.

**Typical approaches:** Onset detection + beat tracking (dynamic programming, hidden Markov models, CNNs). Libraries: madmom, librosa.beat_track, Essentia beat detectors.

### 3.4 Tempo Estimation

**Definition:** Estimate the beats per minute (BPM) of the performance and track tempo stability over time.

**Relevance to RiazAI:** A subset of rhythm analysis but simpler to implement first. Tempo stability within a practice session is a useful consistency metric. Many musicians struggle to maintain steady tempo during improvisation.

**Typical approaches:** Autocorrelation of onset envelope, comb filterbank, tempo histograms. Simpler than full rhythm analysis.

### 3.5 Onset Detection

**Definition:** Detect the precise timestamps of note onsets (when a new note begins) in the audio signal.

**Relevance to RiazAI:** Onset timing is fundamental to articulation quality. Clean, precise onsets indicate controlled technique; sloppy onsets indicate coordination issues. Required by rhythm analysis (3.3) and note transcription (3.9).

**Typical approaches:** Spectral flux, complex domain, adaptive thresholding. Libraries: librosa.onset.onset_detect, Essentia onset detection.

### 3.6 Vibrato Analysis

**Definition:** Detect and characterise vibrato (periodic pitch modulation) in sustained notes — measure rate (Hz), depth (cents), and regularity.

**Relevance to RiazAI:** Vibrato is a key expressive technique in Indian classical music (particularly vocal and sitar). Its rate, depth, and consistency are markers of advanced technique. Poor vibrato control is a common practice target.

**Typical approaches:** Requires F0 contour (3.1) as input. Then applies peak detection or sinusoidal fitting to the pitch contour to extract vibrato parameters.

### 3.7 Dynamics Analysis

**Definition:** Measure the loudness profile over time — identify crescendos, decrescendos, dynamic range, and volume stability.

**Relevance to RiazAI:** This is closest to what the current prototype claims to measure ("amplitude steadiness", "dynamic range"). A real dynamics analysis would replace the heuristic with actual measured values.

**Typical approaches:** RMS energy per frame, loudness (ITU-R BS.1770 / K-weighting), dB SPL estimation. Relatively straightforward signal processing — no pitch detection needed.

### 3.8 Timbre / Tone Quality Analysis

**Definition:** Characterise the spectral shape of the sound — identify spectral centroid, bandwidth, rolloff, MFCCs, and harmonic structure.

**Relevance to RiazAI:** Timbre quality is subjective but some aspects (spectral brightness, harmonic clarity, noise content) can be objectively measured. Could distinguish between a clear, resonant tone and a harsh or breathy one. Highly instrument-dependent.

**Typical approaches:** MFCCs, spectral centroid, spectral flatness, harmonic-to-noise ratio. Libraries: librosa.feature, Essentia spectral descriptors.

### 3.9 Note Transcription (Automatic)

**Definition:** Automatically detect individual notes in the audio — their pitch, onset time, offset time, and duration — producing a note-level transcription.

**Relevance to RiazAI:** The most information-rich analysis. A transcription enables intonation measurement, rhythm analysis, dynamic analysis per note, and score comparison. However, it is also the most complex and error-prone.

**Typical approaches:** F0 contour + onset detection → note segmentation → pitch assignment. Or end-to-end models (OnsetsAndFrames, Basic Pitch, ByteDance). Highly dependent on audio quality and monophonic/polyphonic complexity.

### 3.10 Score Alignment

**Definition:** Align a detected performance against a known score or reference representation (e.g., a MIDI file, a lead sheet, or a reference recording) and compute matching accuracy.

**Relevance to RiazAI:** Directly answers "how well did the musician play the intended piece?" Requires note transcription (3.9) or a score representation. For Indian classical, the "score" might be a raga scale template rather than a fixed Western score.

**Typical approaches:** Dynamic time warping (DTW), hidden Markov model alignment, cross-correlation. Requires a reference score input from the user.

---

## 4. Per-Candidate Evaluation

Each candidate is assessed across 10 attributes. Scores use the following scale:

- **Difficulty:** ★☆☆☆☆ (trivial) → ★★★★★ (research-level)
- **Latency:** <1s → 1–5s → 5–15s → 15–60s → >60s
- **Dependency burden:** None → Light → Moderate → Heavy

### 4.1 Pitch / F0 Estimation

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Raw audio (mono or stereo); no additional user input needed |
| **Expected output** | F0 contour: array of `(timestamp_hz, frequency_hz, confidence)` tuples; also: `averageF0`, `f0Range`, `noteCount` |
| **Computation layer** | Layer 1 (Raw Audio Analysis) — this IS a raw feature extraction |
| **Frontend representation** | `overallScore` could reflect F0 tracking quality; `accuracy` could be pitch estimation confidence; new `pitch` extension slot in `AnalysisResponse`; optional pitch contour SVG in results |
| **Persistence requirements** | F0 contour per session (potentially large — downsampling needed); `averageF0`, `f0Range` in session schema; `engineVersion: 'pitch-v1'` |
| **Difficulty** | ★★★☆☆ — Well-established algorithms (YIN, pYIN, CREPE); piptrack/pyin in librosa are production-ready; monophonic is tractable, polyphonic is hard |
| **Likely latency** | 1–5s for a 3-minute mono WAV (YIN/CREPE on CPU); <1s with GPU for CREPE |
| **Dependency burden** | Moderate — requires librosa (Python), CREPE model weights (~20MB), or a Java-native port; or a Python microservice |
| **Evaluation complexity** | Moderate — metrics exist (gross error rate, voicing recall, voicing false alarm); requires annotated F0 ground truth datasets |
| **Architecture compatibility** | High — fits Layer 1 perfectly; output maps to existing `AnalysisResponse` extension slots; no frontend structural changes needed |

### 4.2 Intonation Accuracy

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Detected F0 contour (from 3.1) + reference pitches (raga scale template or user-provided score) |
| **Expected output** | `intonationAccuracy: number` (0–100); `meanCentDeviation: number`; `centDeviationDistribution: histogram`; per-note cent deviations |
| **Computation layer** | Layer 2 (Derived Metrics) — transforms F0 data into interpretable accuracy scores |
| **Frontend representation** | Maps to `accuracy` field (replacing heuristic meaning); cent deviation histogram as optional visualisation |
| **Persistence requirements** | `intonationAccuracy` in session schema; raga scale reference stored per session or per instrument profile |
| **Difficulty** | ★★★★☆ — Requires pitch detection (3.1) as prerequisite; requires reference pitch model (raga templates are non-trivial for Indian classical with microtonal shrutis); cent deviation calculation is simple once F0 and reference are available |
| **Likely latency** | Negligible beyond pitch detection latency (<100ms additional computation) |
| **Dependency burden** | Moderate — requires pitch detection library + raga scale reference data; raga templates need musicological knowledge to define correctly |
| **Evaluation complexity** | High — ground truth requires expert-annotated intonation data; cent deviation thresholds for "good/bad" are culturally and contextually dependent |
| **Architecture compatibility** | High — directly maps to existing `accuracy` field; the frontend already renders this; minimal new UI needed |

### 4.3 Rhythm Analysis

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Raw audio; optionally a reference tala (rhythmic cycle) specification |
| **Expected output** | `tempoEstimate: number` (BPM); `beatPositions: number[]` (timestamps); `talaAlignment: number` (0–100); `rhythmicPattern: string` (detected pattern) |
| **Computation layer** | Layer 1 (beat tracking) + Layer 2 (tala alignment scoring) |
| **Frontend representation** | Maps to `consistency` field (rhythmic consistency); beat visualization in results; tala cycle overlay |
| **Persistence requirements** | `estimatedBPM`, `tempoStability`, `talaAlignment` in session schema |
| **Difficulty** | ★★★★☆ — Beat tracking in Indian classical is harder than Western pop (complex talas, tempo rubato, non-isochronous beats); tala detection from audio is an active research area |
| **Likely latency** | 1–5s for beat tracking; additional latency for tala identification |
| **Dependency burden** | Moderate to Heavy — madmom (Python) is best-in-class but heavy; tala-specific models may need custom training data |
| **Evaluation complexity** | High — F-measure for beat tracking exists; tala alignment metrics are less standardised; Indian classical rhythm datasets are scarce |
| **Architecture compatibility** | High — fits existing `consistency` field; beat visualization requires new UI component but no architectural changes |

### 4.4 Tempo Estimation

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Raw audio |
| **Expected output** | `estimatedBPM: number`; `tempoStability: number` (0–100, variance of inter-beat intervals); `tempoConfidence: number` |
| **Computation layer** | Layer 1 (Raw Audio Analysis) — subset of rhythm analysis |
| **Frontend representation** | Could replace `stability` field (tempo stability); BPM displayed in session details |
| **Persistence requirements** | `estimatedBPM`, `tempoStability` in session schema |
| **Difficulty** | ★★★☆☆ — Mature algorithms exist (autocorrelation, comb filter); simpler than full rhythm analysis |
| **Likely latency** | <1–2s — one of the fastest computations |
| **Dependency burden** | Light — librosa tempo estimation is lightweight; can run on backend CPU |
| **Evaluation complexity** | Low-Moderate — BPM accuracy is straightforward to measure; tempo stability has clear mathematical definition |
| **Architecture compatibility** | High — maps to existing `stability` or `consistency` fields; minimal new UI |

### 4.5 Onset Detection

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Raw audio |
| **Expected output** | `onsetTimestamps: number[]`; `onsetCount: number`; `onsetRegularity: number` (0–100); `onsetPrecision: number` (if reference available) |
| **Computation layer** | Layer 1 (Raw Audio Analysis) — feature extraction |
| **Frontend representation** | `onsetCount` displayed in session details; onset regularity maps to `consistency`; waveform with onset markers as optional visualisation |
| **Persistence requirements** | `onsetCount`, `onsetRegularity` in session schema; raw onset timestamps can be discarded after metric computation |
| **Difficulty** | ★★☆☆☆ — Well-established; librosa onset detection is production-ready for monophonic and most polyphonic music |
| **Likely latency** | <1s — very fast computation |
| **Dependency burden** | Light — librosa onset detection; pure signal processing, no ML models needed |
| **Evaluation complexity** | Low — F-measure with tolerance window is standard; annotated onset datasets exist (e.g., RWC, AIST) |
| **Architecture compatibility** | High — fits existing schema fields; can replace or augment current heuristic "consistency" |

### 4.6 Vibrato Analysis

| Attribute | Assessment |
|-----------|------------|
| **Required input** | F0 contour (from 3.1) — cannot be computed from raw audio alone |
| **Expected output** | `vibratoRate: number` (Hz); `vibratoDepth: number` (cents); `vibratoRegularity: number` (0–100); `sustainedNoteCount: number` |
| **Computation layer** | Layer 2 (Derived Metrics) — derived from F0 contour |
| **Frontend representation** | New optional section in results; vibrato rate/depth as supplementary metrics; maps partially to `stability` |
| **Persistence requirements** | `vibratoRate`, `vibratoDepth`, `vibratoRegularity` in session schema; requires F0 contour to be available |
| **Difficulty** | ★★★★☆ — Requires reliable F0 contour as input; vibrato detection in the presence of ornamentation (gamak, meend) in Indian classical is non-trivial; regular vibrato vs. intentional pitch modulation is hard to distinguish |
| **Likely latency** | Negligible beyond F0 computation |
| **Dependency burden** | Moderate — requires pitch detection (3.1) as prerequisite; adds no new heavy dependencies but compounds the pitch detection dependency chain |
| **Evaluation complexity** | High — vibrato annotation is rare in existing datasets; ground truth requires expert labelling; Indian classical ornamentation makes automated evaluation especially challenging |
| **Architecture compatibility** | Medium — requires pitch detection as prerequisite; no existing schema field maps cleanly; new optional fields needed; new UI section needed |

### 4.7 Dynamics Analysis

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Raw audio — no additional input needed |
| **Expected output** | `dynamicRange: number` (dB); `rmsLevel: number`; `loudnessProfile: time-series`; `volumeStability: number` (0–100) |
| **Computation layer** | Layer 1 (Raw Audio Analysis) — RMS/loudness computation |
| **Frontend representation** | Directly replaces current `signalEnergy` and `dynamicRange` display strings with real measured values; maps to `stability` field; dynamics profile as optional visualisation |
| **Persistence requirements** | `dynamicRange: number`, `rmsLevel: number`, `volumeStability: number` in session schema; replaces display-only strings |
| **Difficulty** | ★★☆☆☆ — RMS and loudness computation are mature, standard DSP; no ML required; ITU-R BS.1770 is well-documented |
| **Likely latency** | <1s — extremely fast (simple amplitude computation) |
| **Dependency burden** | Light — can be implemented with basic DSP (no heavy libraries); RMS is trivial in Java |
| **Evaluation complexity** | Low — dB measurements are objective; volume stability has a clear mathematical definition (variance of RMS envelope); no ground truth annotation needed for basic metrics |
| **Architecture compatibility** | Very High — replaces the exact heuristic the current prototype claims to compute; maps to existing `stability` field and `signalEnergy`/`dynamicRange` display strings; minimal schema changes |

### 4.8 Timbre / Tone Quality Analysis

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Raw audio; optionally instrument label for instrument-specific models |
| **Expected output** | `spectralCentroid: number`; `spectralBandwidth: number`; `spectralFlatness: number`; `harmonicToNoiseRatio: number`; `timbreProfile: feature-vector` |
| **Computation layer** | Layer 1 (Raw Audio Analysis) — spectral feature extraction |
| **Frontend representation** | Supplementary display in session details; no existing field maps cleanly; could inform `feedbackSummary` text generation |
| **Persistence requirements** | Spectral descriptors in session schema; timbre profile is high-dimensional (MFCCs = 13–20 coefficients per frame) — needs summarisation for storage |
| **Difficulty** | ★★★☆☆ — Standard spectral analysis; librosa MFCCs are mature; interpretation of features as "tone quality" is subjective |
| **Likely latency** | <1–2s — fast spectral computation |
| **Dependency burden** | Light-Moderate — librosa spectral features; no ML models needed for basic descriptors; MFCCs are computationally cheap |
| **Evaluation complexity** | High — "tone quality" is subjective; spectral features are objective but mapping them to perceptual quality requires perceptual validation; no standard evaluation protocol exists for music tone quality assessment |
| **Architecture compatibility** | Medium — no existing schema field for timbre; would require new fields and new UI sections; less directly useful for the existing metric display pattern |

### 4.9 Note Transcription (Automatic)

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Raw audio; optionally instrument label and pitch range constraints |
| **Expected output** | `notes: NoteDetection[]` where each note has `{pitch, onset, offset, duration, velocity, confidence}`; also: `noteCount`, `averageNoteDuration`, `pitchClassDistribution` |
| **Computation layer** | Layer 1 (Raw Audio Analysis) — requires F0 estimation + onset detection + note segmentation |
| **Frontend representation** | Note list displayed in session details; note-level pitch/rhythm visualisation; enables all downstream analyses (intonation, rhythm, dynamics per note) |
| **Persistence requirements** | `notes[]` array per session (potentially large — a 3-minute session at 4 notes/sec = 720 notes); needs summarisation for session schema; individual note data for detailed analysis view |
| **Difficulty** | ★★★★★ — Monophonic transcription is tractable; polyphonic transcription is research-level; Indian classical ornamentation (gamak, meend) defies clean note segmentation |
| **Likely latency** | 5–15s for monophonic; 15–60s for polyphonic |
| **Dependency burden** | Heavy — requires F0 estimation + onset detection + segmentation algorithm; or a full transcription model (Basic Pitch, OnsetsAndFrames); model weights are 50–200MB |
| **Evaluation complexity** | High — piano roll F-measure, note-level precision/recall; requires annotated transcription datasets; Indian classical transcription datasets are very scarce |
| **Architecture compatibility** | Medium — rich data but no clean mapping to existing 4-metric display; requires significant new UI (note-level visualisation); schema extension is substantial |

### 4.10 Score Alignment

| Attribute | Assessment |
|-----------|------------|
| **Required input** | Detected notes (from 3.9) + reference score (MIDI, MusicXML, or raga template); user must provide the reference |
| **Expected output** | `alignmentScore: number` (0–100); `missedNotes: number`; `extraNotes: number`; `timingDeviation: number`; `pitchDeviation: number` |
| **Computation layer** | Layer 2 (Derived Metrics) — comparison of transcription against reference |
| **Frontend representation** | `accuracy` field (replaced with alignment score); note-by-note comparison view; deviation heatmap |
| **Persistence requirements** | `alignmentScore`, `missedNotes`, `extraNotes` in session schema; reference score must be stored or referenced |
| **Difficulty** | ★★★★★ — Requires note transcription (3.9) as prerequisite; DTW alignment is mature but reference score input UX is complex; Indian classical "score" is template-based, not fixed-notation |
| **Likely latency** | Negligible beyond transcription latency (DTW is fast on note sequences) |
| **Dependency burden** | Heavy — requires note transcription + reference score infrastructure; user must upload or select a score; reference score management is a significant feature |
| **Evaluation complexity** | High — alignment accuracy metrics exist; but requires reference scores and annotated performances; Indian classical score representation is non-trivial |
| **Architecture compatibility** | Low-Medium — requires user-provided reference (new UX flow); transcription prerequisite; significant new UI for score display; not a natural "first" capability |

---

## 5. Feasibility Tiers

Based on the assessments above, candidates are grouped into three tiers.

### 5.1 Feasible Now (with Spring Boot backend integration)

These capabilities require **no prerequisite analysis capabilities**, produce output that maps to existing frontend fields, and use established algorithms with acceptable latency.

| Candidate | Why It Fits |
|-----------|-------------|
| **Dynamics Analysis (3.7)** | Simplest computation (RMS/loudness); no ML needed; directly replaces the current heuristic; maps to existing `stability`, `signalEnergy`, `dynamicRange` fields; <1s latency; Java-native DSP possible |
| **Onset Detection (3.5)** | Mature algorithms; very fast (<1s); maps to existing `consistency` field; low dependency burden; standard evaluation metrics |
| **Tempo Estimation (3.4)** | Simplest rhythm feature; fast computation; maps to `stability` or `consistency`; well-established evaluation |
| **Pitch / F0 Estimation (3.1)** | Well-established algorithms; 1–5s latency is acceptable; high architectural compatibility; but requires a pitch library dependency |

### 5.2 Feasible After Backend Integration + Prerequisite Analysis

These capabilities require one or more of the "feasible now" capabilities as a prerequisite, or require richer infrastructure.

| Candidate | Prerequisites | Why It's in This Tier |
|-----------|---------------|----------------------|
| **Intonation Accuracy (3.2)** | Requires pitch detection (3.1) + raga scale reference data | Derives from F0; needs musicological reference; evaluation requires annotated data |
| **Vibrato Analysis (3.6)** | Requires pitch detection (3.1) + vibrato detection from F0 contour | Depends on reliable F0; Indian classical ornamentation complicates detection |
| **Rhythm Analysis (3.3)** | Requires onset detection (3.5) + beat tracking | Beat tracking in Indian classical is harder than simple tempo; tala detection is research-adjacent |

### 5.3 Future Research-Level Capability

These are significantly harder, require multiple prerequisites, or involve active research challenges.

| Candidate | Why It's in This Tier |
|-----------|----------------------|
| **Note Transcription (3.9)** | Research-level for Indian classical (ornamentation); heavy model requirements; large output data; scarce training data |
| **Score Alignment (3.10)** | Requires transcription + reference score infrastructure + user UX for score input; Indian classical score representation is an unsolved design problem |
| **Timbre / Tone Quality (3.8)** | Computationally feasible but perceptual evaluation is subjective; no standard "tone quality score" exists; requires perceptual validation study |

---

## 6. Layer Definitions for Each Candidate

This section clarifies where each candidate sits in the four-layer architecture defined in RIAZAI_V2_ANALYSIS_READINESS.md §8.

### Layer 1: Raw Audio Analysis

**Candidates that belong here:**

| Candidate | Layer 1 Outputs |
|-----------|----------------|
| Pitch / F0 Estimation (3.1) | F0 contour (timestamp, frequency, confidence) |
| Dynamics Analysis (3.7) | RMS envelope, peak amplitude, loudness measurements |
| Onset Detection (3.5) | Onset timestamps, onset strength envelope |
| Tempo Estimation (3.4) | Tempo histogram, beat period estimate |
| Timbre / Tone Quality (3.8) | Spectral descriptors (centroid, bandwidth, MFCCs) |
| Note Transcription (3.9) | F0 + onsets + segmentation → note list |

### Layer 2: Derived Metrics

**Candidates that belong here:**

| Candidate | Layer 2 Outputs |
|-----------|----------------|
| Intonation Accuracy (3.2) | Cent deviation, accuracy score (requires Layer 1 pitch + reference) |
| Vibrato Analysis (3.6) | Vibrato rate, depth, regularity (requires Layer 1 pitch) |
| Rhythm Analysis (3.3) | Beat positions, tala alignment score (requires Layer 1 onsets) |
| Score Alignment (3.10) | Alignment score, deviation metrics (requires Layer 1 notes + reference) |

### Layer 3: Pedagogical Feedback

**All candidates** eventually produce text output in this layer:

| Candidate | Feedback Type |
|-----------|---------------|
| Pitch / F0 | "Your F0 range was 180–420 Hz. Pitch tracking confidence was 87%." |
| Intonation | "Overall intonation accuracy: 82%. Deviations were largest in the upper register." |
| Rhythm | "Beat adherence was strong (91%). Consider practising with a tala drone for the vilambit section." |
| Tempo | "Your average tempo was 92 BPM with moderate stability. Tempo drifted during improvisation sections." |
| Onset | "Detected 142 note onsets. Onset regularity suggests consistent articulation." |
| Vibrato | "Average vibrato rate: 5.8 Hz, depth: 32 cents. Vibrato was more regular in sustained passages." |
| Dynamics | "Dynamic range: 14 dB. Volume was steady during alap but showed more variation in the gat section." |
| Timbre | "Spectral centroid indicates a bright tone. Harmonic-to-noise ratio was above average." |
| Note Transcription | "Detected 142 notes across 3 minutes. Average note duration: 1.3 seconds." |
| Score Alignment | "Alignment score: 78%. 12 notes deviated from the reference by more than 50 cents." |

### Layer 4: Longitudinal Analytics

**All candidates** contribute to longitudinal tracking once multiple sessions are saved:

| Candidate | Longitudinal Metric |
|-----------|-------------------|
| Pitch / F0 | Average F0 range over time; pitch confidence trend |
| Intonation | Intonation accuracy trend; per-register accuracy heatmap |
| Rhythm | Tala alignment improvement over time |
| Tempo | Tempo stability trend across sessions |
| Onset | Onset regularity trend; articulation consistency |
| Vibrato | Vibrato quality trend across practice sessions |
| Dynamics | Dynamic range improvement; volume stability trend |
| Timbre | Spectral centroid trend (tone brightness over time) |
| Note Transcription | Note count trend; average complexity trend |
| Score Alignment | Alignment score improvement over time |

---

## 7. Provisional Decision Matrix

This matrix provides a structured scoring framework for comparing candidates. Scores are **not research findings** — they are placeholders to be filled after investigation. The framework defines what to measure and how to weight it.

### 7.1 Evaluation Criteria

| Criterion | Weight | Definition | How to Evaluate |
|-----------|--------|------------|-----------------|
| **Research Validity** | 25% | How well-established is the algorithm in peer-reviewed literature? How validated are available implementations? | Literature survey; citation count of key papers; availability of validated open-source implementations |
| **Technical Feasibility** | 20% | Can it be implemented in the Spring Boot backend with acceptable latency and resource usage? Does it fit the existing architecture? | Prototype timing on representative audio; dependency audit; architecture fit assessment |
| **User Usefulness** | 25% | Does the output directly help a practicing musician improve? Is the metric interpretable without expert knowledge? | User interview survey; comparison with what teachers actually listen for; interpretability assessment |
| **Evaluation Feasibility** | 15% | Can we measure whether the analysis is correct? Are ground truth datasets available? | Dataset availability survey; annotation cost estimate; metric availability assessment |
| **Dataset Availability** | 10% | Are there relevant training/validation/test datasets, especially for Indian classical music? | Dataset catalogue survey; relevance to RiazAI's target instruments |
| **Implementation Effort** | 5% | Total engineering time from start to working integration (backend + frontend + tests) | T-shirt sizing estimate after technical spike |

### 7.2 Scoring Rubric

Each criterion is scored 1–5:

| Score | Research Validity | Technical Feasibility | User Usefulness | Evaluation Feasibility | Dataset Availability | Implementation Effort |
|-------|-------------------|----------------------|-----------------|----------------------|---------------------|----------------------|
| 5 | Definitive consensus; production-grade implementations exist | Runs in <2s on CPU; pure Java possible; zero new dependencies | Directly answers a question every musician asks; immediately actionable | Standard metrics; annotated datasets readily available | Large Indian classical datasets exist | <1 week end-to-end |
| 4 | Strong evidence; multiple validated implementations | Runs in 2–5s; Python microservice acceptable; moderate dependencies | Very useful; most musicians would benefit; requires some explanation | Metrics exist; some annotation needed | Some relevant datasets exist; may need adaptation | 1–2 weeks |
| 3 | Established but with open questions; limited implementations | Runs in 5–15s; significant dependencies; GPU helpful but not required | Useful for intermediate/advanced musicians; requires context | Metrics partially defined; custom annotation needed | Limited datasets; would need to curate | 2–4 weeks |
| 2 | Emerging research; few implementations; significant gaps | Runs in 15–60s; heavy dependencies; GPU likely required | Niche usefulness; only for specific instruments or genres | No standard metrics; custom evaluation framework needed | Very few datasets; significant curation effort | 1–2 months |
| 1 | Speculative; no validated implementation; active research area | >60s or impractical for real-time; prohibitive dependencies | Unclear user value; expert-only interpretation | No evaluation methodology; subjective assessment only | No relevant datasets; would need to create from scratch | >2 months; research project |

### 7.3 Decision Matrix Template

**Instructions:** After completing research for each candidate, fill in the scores. The weighted total determines relative priority. The highest-scoring candidate is the recommended first implementation, subject to feasibility tier constraints (§5).

| Candidate | Research Validity (25%) | Technical Feasibility (20%) | User Usefulness (25%) | Evaluation Feasibility (15%) | Dataset Availability (10%) | Implementation Effort (5%) | Weighted Total | Tier (§5) |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Pitch / F0 Estimation (3.1) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | Now |
| Intonation Accuracy (3.2) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | After |
| Rhythm Analysis (3.3) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | After |
| Tempo Estimation (3.4) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | Now |
| Onset Detection (3.5) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | Now |
| Vibrato Analysis (3.6) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | After |
| Dynamics Analysis (3.7) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | Now |
| Timbre / Tone Quality (3.8) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | Future |
| Note Transcription (3.9) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | Future |
| Score Alignment (3.10) | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | _ /5 | Future |

### 7.4 Weighted Total Formula

```
Weighted Total = (Research Validity × 0.25)
               + (Technical Feasibility × 0.20)
               + (User Usefulness × 0.25)
               + (Evaluation Feasibility × 0.15)
               + (Dataset Availability × 0.10)
               + ((6 - Implementation Effort) × 0.05)
```

Note: `Implementation Effort` is **inverted** — lower effort (higher score) contributes more. A score of 5 (effort = <1 week) maps to 5; a score of 1 (effort = >2 months) maps to 5 - 1 = 4 weighted contribution. This ensures effort is penalised appropriately.

Actually, the simpler formulation: Implementation Effort uses the same 1–5 scale as other criteria but **in the formula, use `(6 - effort_score)` so that low effort (score 5) becomes 1 and high effort (score 1) becomes 5**, OR more intuitively, define the Implementation Effort column as **5 = minimal effort, 1 = maximal effort** (same direction as other columns) and use it directly in the weighted sum. The column header already says "Implementation Effort" — a score of 5 means low effort.

### 7.5 Additional Decision Factors (Not Scored)

Beyond the weighted matrix, the following qualitative factors should influence the final decision:

1. **Sequencing value:** Does this capability unlock downstream capabilities? (Pitch detection enables intonation, vibrato, and transcription.)
2. **Differentiation:** Does this capability make RiazAI meaningfully different from a simple recording app?
3. **Demo value:** Can the output be visualised in a way that immediately communicates "this is real analysis, not a heuristic"?
4. **Incremental delivery:** Can a minimum viable version ship quickly and be improved iteratively?
5. **Musicological alignment:** Does this capability address what Indian classical musicians and teachers actually evaluate?

---

## 8. Recommended Evaluation Process

This section defines the process for using this framework — it does not contain findings.

### 8.1 Phase 1: Literature Survey (for each candidate)

For each candidate capability:
- Survey 5–10 key papers on the algorithm
- Identify the most cited and most recent validated implementation
- Note the reported accuracy metrics on standard datasets
- Assess whether Indian classical music is specifically addressed
- Document known limitations and failure modes

### 8.2 Phase 2: Implementation Spike (for top 2–3 candidates)

For each shortlisted candidate:
- Implement a minimal proof-of-concept in Python (or Java if mature library exists)
- Test on 5–10 representative audio files (Indian classical vocal + instrumental)
- Measure: latency, accuracy, output quality, dependency footprint
- Document: what works, what fails, what needs tuning

### 8.3 Phase 3: User Value Assessment

- Present example outputs to 3–5 musicians (or music educators)
- Ask: "Is this useful? Would you use this? What would you do differently based on this?"
- Document: perceived value, interpretability, actionability
- Compare against what teachers actually listen for in a practice session

### 8.4 Phase 4: Architecture Integration Test

For the recommended candidate:
- Map the spike output to the `AnalysisResponse` interface (RIAZAI_V2_ANALYSIS_READINESS.md §7)
- Verify the output fills the existing `MetricBreakdown` fields meaningfully
- Verify `feedbackSummary`, `focusPoints`, and `suggestedNextStep` can be generated from the output
- Verify the output is expressible within the session schema extension (§10.1 of readiness doc)
- Estimate total engineering effort for production integration

### 8.5 Phase 5: Decision

- Complete the decision matrix (§7.3) with actual scores
- Weight the qualitative factors (§7.5)
- Select the first capability
- Define the minimum viable scope (what ships in the first version vs. what is deferred)
- Define success criteria for the first implementation

---

## Appendix A: Dependency Landscape

The following table summarises the key external dependencies each candidate would introduce, and whether Java-native alternatives exist for the Spring Boot backend.

| Candidate | Python Library | Java Alternative | Notes |
|-----------|---------------|-----------------|-------|
| Pitch / F0 | librosa.pyin, CREPE | TarsosDSP (Java), jAudio | TarsosDSP has mature YIN implementation |
| Intonation | (derives from F0) | (derives from F0) | Pure computation on F0 output |
| Rhythm | madmom, librosa.beat | TarsosDSP beat tracking | Madmom is best-in-class but heavy |
| Tempo | librosa.beat.tempo | TarsosDSP tempo | Simple autocorrelation possible in Java |
| Onset | librosa.onset | TarsosDSP onset detection | Spectral flux is simple to implement in Java |
| Vibrato | (derives from F0) | (derives from F0) | Pure computation on F0 output |
| Dynamics | librosa.feature.rms | Java AudioSystem + manual RMS | Trivial in any language |
| Timbre | librosa.feature.mfcc | TarsosDSP MFCC, jAudio | MFCC computation is standard |
| Transcription | basic_pitch, OnsetsAndFrames | No mature Java option | Requires Python microservice |
| Score Alignment | madmom, music21 | Java DTW implementations | DTW is straightforward in Java |

**Key observation:** Pitch detection (TarsosDSP) and dynamics (manual RMS) have the strongest Java-native options, making them the most architecturally clean choices for a Spring Boot backend.

---

## Appendix B: Indian Classical Music Considerations

Several factors specific to Indian classical music affect the feasibility and value of each candidate:

1. **Monophonic tendency:** Both vocal and most melodic instrument performances are predominantly monophonic (one note at a time), which simplifies pitch detection and transcription significantly compared to polyphonic music.

2. **Microtonal precision:** Indian classical uses shrutis (microtones) that are not captured by Western 12-TET. Intonation evaluation must use cent-based deviation from a reference, not note-name matching.

3. **Ornamentation complexity:** Gamak (heavy oscillation), meend (glide), andkan (grace notes) are not mere embellishments — they are integral to raga identity. Any pitch-based analysis must account for intentional pitch modulation vs. unintentional deviation.

4. **Tala diversity:** Indian rhythmic cycles (teentaal, jhaptal, rupak, etc.) are structurally different from Western metres. Beat tracking algorithms designed for Western pop may not work well.

5. **Drone reference:** The tanpura drone provides a constant tonal reference. This could be exploited as an automatic reference pitch for intonation measurement — a unique advantage of this musical tradition.

6. **Raga-specific evaluation:** The same note played in Raga Yaman vs. Raga Bhairavi has different correctness criteria. Any evaluation system must be raga-aware, which adds complexity but also specificity.

7. **Instrument diversity:** RiazAI targets vocal, sitar, sarod, and potentially other instruments. Each has different timbral characteristics and analysis requirements.

---

## Appendix C: Glossary

| Term | Definition |
|------|-----------|
| F0 | Fundamental frequency — the lowest frequency of a periodic sound, perceived as pitch |
| Cent | A unit of pitch interval; 1200 cents = 1 octave; 100 cents = 1 semitone in 12-TET |
| Shruti | Microtonal interval in Indian classical music; traditionally 22 shrutis per octave |
| Raga | A melodic framework in Indian classical music defined by specific notes, phrases, and ornaments |
| Tala | A rhythmic cycle in Indian classical music (e.g., Teentaal = 16 beats) |
| Gamak | A heavy oscillation or shake between two adjacent notes |
| Meend | A smooth glide between two notes |
| RMS | Root Mean Square — a measure of signal amplitude/loudness |
| MFCC | Mel-Frequency Cepstral Coefficients — a compact representation of spectral shape |
| Onset | The beginning of a note or musical event in an audio signal |
| DTW | Dynamic Time Warping — an algorithm for aligning two time-series that may have different speeds |
| BPM | Beats Per Minute — a measure of tempo |
