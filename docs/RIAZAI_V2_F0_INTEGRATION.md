# RiazAI V2 — F0 Production Integration

**Status:** Complete  
**Date:** 2026-09-14  
**Milestone:** 7 — Production F0 Integration  
**Scope:** Replace simulated analysis path with real backend-driven F0 analysis while preserving the existing product architecture.

---

## 1. Architecture

```
React Frontend                    Spring Boot Backend
─────────────                    ──────────────────
Analyse.jsx                      AnalysisController (POST /api/analyse)
  → api.js (fetch)                 → AnalysisOrchestrationService
  → AnalysisProgress.jsx             → F0AnalysisService (preprocessing + YIN)
  → AnalysisResults.jsx                → SyntheticAudioGenerator (WAV decode)
    → F0AnalysisResults.jsx            → YinPitchDetector (YIN algorithm)
    → MetricBreakdown.jsx              → F0DerivedMetrics (metrics)
  → storage.js (localStorage)         → AudioAnalysisService (legacy heuristic)
  → SessionDetailModal.jsx          → AnalysisResponse (JSON model)
  → Analytics.jsx
  → Dashboard.jsx
```

### Package Structure (Backend)

```
com.riazai/
├── config/
│   └── WebConfig.java                    ← CORS configuration
├── controller/
│   ├── AnalysisController.java           ← REST API: POST /api/analyse
│   └── PracticeController.java           ← Legacy Thymeleaf controller (preserved)
├── model/
│   ├── AnalysisResponse.java             ← JSON response model (records)
│   └── PerformanceMetrics.java           ← Legacy heuristic model (preserved)
├── service/
│   ├── AnalysisOrchestrationService.java ← Orchestrates F0 + fallback
│   ├── AudioAnalysisService.java         ← Legacy heuristic (preserved)
│   └── F0AnalysisService.java            ← F0 pipeline + preprocessing
└── spike/f0/
    ├── F0DerivedMetrics.java             ← Metrics computation
    ├── F0Frame.java                      ← Frame data structure
    ├── F0Pipeline.java                   ← Pipeline orchestration (preserved)
    ├── SyntheticAudioGenerator.java       ← WAV decoder + test signals
    └── YinPitchDetector.java             ← YIN algorithm implementation
```

---

## 2. Backend Flow

```
1. POST /api/analyse (multipart audio file)
2. AnalysisOrchestrationService.analyse(file)
   ├─ Validates: not null, not empty, ≤ 10 MB
   ├─ Calls F0AnalysisService.analyseAudio(bytes, fileName)
   │   ├─ WAV decode (SyntheticAudioGenerator.decodeWav)
   │   ├─ Preprocessing: trimSilence → removeDCOffset → normalizeAmplitude
   │   ├─ F0 extraction: YinPitchDetector.detect(samples)
   │   ├─ Derived metrics: F0DerivedMetrics.compute(frames)
   │   └─ Build AnalysisResponse (source="real")
   ├─ If real analysis succeeded: return it
   └─ If failed or no voiced material: return it with pitch.available=false
3. Returns JSON AnalysisResponse
```

---

## 3. API Request/Response

### Request

```
POST /api/analyse
Content-Type: multipart/form-data
Body: audioFile=<audio bytes>
```

### Response (Real F0 Analysis)

```json
{
  "analysisVersion": "f0-yin-1.0",
  "source": "real",
  "audio": {
    "fileName": "violin_a4.wav",
    "durationSeconds": 3.0,
    "sampleRate": 44100,
    "totalSamples": 132300
  },
  "pitch": {
    "available": true,
    "medianHz": 440.1,
    "rangeHz": 3.8,
    "stability": 0.98,
    "voicingRatio": 0.95,
    "frameCount": 255
  },
  "metrics": {
    "pitchDisplay": "440.1 Hz",
    "stabilityPercentage": 98,
    "voicingPercentage": 95
  },
  "processing": {
    "processingTimeMs": 143.0
  }
}
```

### Response (No Voiced Material)

```json
{
  "analysisVersion": "f0-yin-1.0",
  "source": "real",
  "audio": { "fileName": "silence.wav", "durationSeconds": 1.0, "sampleRate": 44100 },
  "pitch": { "available": false, "frameCount": 86 },
  "processing": { "processingTimeMs": 10.0 },
  "feedback": "No voiced material was detected in the recording.",
  "fallback": false
}
```

### Response (Fallback / Demo)

```json
{
  "analysisVersion": "heuristic-prototype-v1",
  "source": "demo",
  "audio": { "fileName": "test.wav", "durationSeconds": 0 },
  "metrics": { "overallScore": 86, "stabilityPercentage": 84, "voicingPercentage": 87 },
  "processing": { "processingTimeMs": 0 },
  "feedback": "Backend analysis unavailable.",
  "fallback": true
}
```

---

## 4. Preprocessing

Applied before F0 extraction:

1. **Silence trimming** — Removes leading/trailing silence using RMS energy windows (512-sample windows, threshold 0.001)
2. **DC offset removal** — Subtracts mean amplitude to centre signal around zero
3. **Amplitude normalization** — Scales peak to 0.95 for consistent detector input
4. **Truncation** — Caps at 30 seconds (1,323,000 samples at 44100 Hz)

---

## 5. YIN Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Sample rate | Per file (default 44100) | Standard audio |
| Frame size | 2048 samples | ~46ms at 44100 Hz |
| Hop size | 512 samples | ~11.6ms (~86 fps) |
| Min frequency | 60 Hz | Below Indian classical range |
| Max frequency | 2000 Hz | Above violin/vocal range |
| Voicing threshold | 0.15 | Conservative voicing detection |

Centralised in `F0AnalysisService` constants — no scattered numeric values.

---

## 6. Derived Metrics

| Metric | Type | Definition |
|--------|------|-----------|
| `medianHz` | Hz | Median F0 of voiced frames |
| `rangeHz` | Hz | max F0 − min F0 |
| `stability` | 0–1 | 1 − coefficient_of_variation |
| `voicingRatio` | 0–1 | Fraction of frames with detected pitch |
| `frameCount` | Count | Total analysis frames |

**Important:** These are raw pitch measurements, not pedagogical scores. Stability reflects F0 coefficient of variation, not playing quality.

---

## 7. Frontend Integration

### API Layer (`src/services/api.js`)
- `uploadForAnalysis(file, options)` — POST multipart to backend
- `checkBackendHealth()` — Health check
- Uses `REACT_APP_API_BASE_URL` env variable (default: `http://localhost:8080`)
- Request timeout: 30 seconds

### Analysis Flow (`Analyse.jsx`)
- **READY** → File selection (AudioDropzone or SelectedFile)
- **UPLOADING** → Sending to backend
- **ANALYSING** → Backend F0 processing (real or fallback)
- **RESULTS** → F0AnalysisResults (real) or MetricBreakdown (demo)

### Results Display
- **Real F0:** F0MetricCard grid (median pitch, range, stability, voicing ratio)
- **Demo Fallback:** Original MetricBreakdown (accuracy, stability, consistency)
- Banner clearly labels: "Real F0 analysis" vs "Demonstration analysis"

---

## 8. Session Mapping

### Real F0 Session

```javascript
{
  source: 'user',
  analysisVersion: 'f0-yin-1.0',
  medianHz: 440.1,
  rangeHz: 3.8,
  pitchStability: 0.98,
  voicingRatio: 0.95,
  frameCount: 255,
  sampleRate: 44100,
  processingTimeMs: 143,
  score: 98, // Derived from stabilityPercentage
}
```

### Legacy Demo Session (backward compatible)

```javascript
{
  source: 'demo',
  score: 88,
  accuracy: 90,
  stability: 86,
  consistency: 88,
}
```

---

## 9. Error Handling

| Error | Handler | Response |
|-------|---------|----------|
| Backend unavailable | Frontend catch → demo fallback | `source: "demo"` |
| Empty file | Backend validation → 400 | Error message |
| File > 10 MB | Backend validation → 400 | Error message |
| Unsupported format | WAV decode fail → fallback | Error message |
| No voiced material | `pitch.available = false` | Explanation |
| Timeout (30s) | Frontend AbortController | Fallback message |

---

## 10. Tests

### Backend (55 tests total)

| Test Class | Tests | Description |
|-----------|:---:|-------------|
| `F0SpikeTest` | 34 | YIN algorithm, derived metrics, pipeline, WAV decode, violin categories |
| `F0AnalysisServiceTest` | 15 | WAV decoding, preprocessing, F0 metrics, response schema, fallback |
| `AnalysisControllerTest` | 6 | Response schema, silence handling, fallback, real analysis |
| `AudioAnalysisServiceTest` | 2 | Legacy heuristic (preserved) |

### Frontend (20 tests, all preserved)
- Milestone 3: Landing page (5 tests)
- Milestone 4: Dashboard & Analysis (6 tests)
- Milestone 5: Sessions & Analytics (9 tests)

---

## 11. Performance

| Metric | Observation |
|--------|-------------|
| 1s WAV analysis | ~300–500ms (including WAV decode) |
| 10s WAV analysis | ~2000–2500ms |
| Preprocessing overhead | <5ms (trim + normalize) |
| YIN computation | Dominant cost (O(n²) per frame) |
| End-to-end latency | <3s for typical 1–5s recordings |

---

## 12. Known Limitations

1. **WAV format only** — Backend decodes PCM WAV. MP3/OGG/FLAC upload falls back to demo mode.
2. **Monophonic only** — YIN assumes single pitch. Double stops produce unreliable results.
3. **No pedagogical feedback** — Layer 3 (coaching) not implemented. Only raw measurements.
4. **YIN accuracy** — ~78–85% harmonic mean. Upgrade path to SwiftF0 (90%+) available.
5. **No real audio validation** — Only synthetic test signals validated. Real violin/vocal recordings needed.
6. **WAV decoder limitations** — Only PCM 8-bit and 16-bit supported. 24/32-bit not handled.

---

## 13. Future Upgrade Path

1. **SwiftF0 via Python microservice** — Replace YIN for higher accuracy (90%+ HM)
2. **Multi-format audio decode** — Add mp3flac via Java AudioSystem or Tarsos
3. **Pedagogical feedback (Layer 3)** — Domain-specific thresholds for raga/instrument
4. **Intonation scoring** — Compare detected F0 against reference scale
5. **Vibrato analysis** — F0 contour analysis for vibrato depth/rate
6. **Database persistence** — Replace localStorage with server-side session storage
7. **Authentication** — User accounts for cross-device session sync
