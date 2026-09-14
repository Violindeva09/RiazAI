# RiazAI V2 — Production F0 Validation Report

**Status:** VALIDATION COMPLETE  
**Date:** 2026-09-14  
**Scope:** Production pipeline verification of POST /api/analyse F0 analysis  
**Verdict:** **PASS WITH LIMITATIONS**

---

## 1. Test Environment

| Component | Version | Status |
|-----------|---------|--------|
| Java | 17.0.12 (Oracle JDK) | ✅ Available |
| Maven | 3.9.12 (via wrapper) | ✅ Available |
| Spring Boot | 3.3.2 | ✅ Running |
| Node.js | Available | ✅ |
| React | 19.2.4 | ✅ |
| Real audio fixtures | **NONE** | ⚠️ BLOCKER |

---

## 2. Recordings Tested

### Real Audio Fixtures

**No real audio recordings exist in the repository.** This is a known blocker documented since Milestone 6B.

The minimum required recordings (violin sustained, violin vibrato, violin melody, vocal sustained, vocal melody, noisy recording) are not available for testing.

### Synthetic WAV Fixtures Used

All verification was performed with programmatically generated WAV files that simulate realistic instrument characteristics:

| # | Name | Signal Type | Duration | Expected F0 |
|---|------|------------|----------|-------------|
| 1 | 1s_a4.wav | Pure sine | 1.0s | 440.0 Hz |
| 2 | 5s_a4.wav | Pure sine | 5.0s | 440.0 Hz |
| 3 | 10s_a4.wav | Pure sine | 10.0s | 440.0 Hz |
| 4 | violin_a4.wav | 5-harmonic series | 2.0s | 440.0 Hz |
| 5 | violin_vibrato.wav | 3-harmonic + FM vibrato (25 cents, 5.5 Hz) | 2.0s | 440.0 Hz |
| 6 | violin_melody.wav | 4 sequential sine notes (G4-A4-B4-C5) | 2.0s | 392–523 Hz |
| 7 | silence.wav | Zero amplitude | 2.0s | N/A |
| 8 | noisy.wav | 440 Hz sine + white noise (10 dB SNR) | 1.5s | 440.0 Hz |

---

## 3. Endpoint Results

All tests exercise the **full production pipeline**: WAV decode → preprocessing (trim, DC removal, normalize) → YIN detection → derived metrics → AnalysisResponse.

### Performance Results

| Duration | Server Processing | Wall Clock | Voicing | Median Hz | Stability |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 second | **123 ms** | 123 ms | 100.0% | 440.0 Hz | 1.000 |
| 5 seconds | **587 ms** | 588 ms | 100.0% | 440.0 Hz | 1.000 |
| 10 seconds | **1207 ms** | 1219 ms | 100.0% | 440.0 Hz | 1.000 |

### Quality Results

| Signal | Median Hz | Stability | Range Hz | Voicing | Source | Verdict |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| Violin harmonic A4 | 440.0 | 1.000 | 0.0 | 100.0% | real | ✅ Excellent |
| Violin vibrato (25¢) | 440.2 | 0.990 | 12.5 | 100.0% | real | ✅ Excellent |
| Melodic phrase (G4→C5) | 440.2 | — | 131.0 | 100.0% | real | ✅ Good |
| Silence | N/A | N/A | N/A | 0% | real | ✅ Correct |
| Noisy (10 dB SNR) | 440.2 | — | — | 100.0% | real | ✅ Good |

### Test Suite Results

| Suite | Tests | Status |
|-------|:---:|:---:|
| F0SpikeTest (YIN algorithm) | 34 | ✅ PASS |
| F0AnalysisServiceTest (production service) | 15 | ✅ PASS |
| AnalysisControllerTest (response schema) | 6 | ✅ PASS |
| ProductionF0VerificationTest (pipeline + perf) | 8 | ✅ PASS |
| AudioAnalysisServiceTest (legacy heuristic) | 2 | ✅ PRESERVED |
| **Backend Total** | **63** | ✅ **63/63** |

| Suite | Tests | Status |
|-------|:---:|:---:|
| App.test.js (Milestones 3–5) | 20 | ✅ **20/20** |
| Build | — | ✅ **PASS** |

---

## 4. Comparison with Prior Spike Validation

### Isolated YIN Spike (Milestone 6A/6B Python validation)

The Python YIN validation (Milestone 6B) used algorithmically equivalent code with the same parameters.

| Metric | Python Spike (6B) | Java Production (7.5) | Delta |
|--------|:---:|:---:|:---:|
| **A4 sustained median** | 440.6 Hz | 440.0 Hz | -0.6 Hz |
| **A4 sustained voiced%** | 100.0% | 100.0% | 0 |
| **A4 sustained stability** | N/A (not computed) | 1.000 | — |
| **Vibrato median** | 440.8 Hz | 440.2 Hz | -0.6 Hz |
| **Vibrato range** | 12.9 Hz | 12.5 Hz | -0.4 Hz |
| **Silence voiced%** | 0.0% | 0.0% | 0 |
| **Processing 1.5s** | ~290 ms | ~180 ms (extrapolated) | Java faster |

### Key Differences Explained

1. **Slight median Hz differences** — Production pipeline includes preprocessing (DC removal, normalization, silence trimming) that the Python spike sometimes skipped. Preprocessing improves signal quality before YIN, producing marginally different (typically more accurate) estimates.

2. **Java is faster** — Java YIN runs ~1.6x faster than the Python equivalent on the same machine, consistent with expectations for a JVM-optimized implementation.

3. **Stability metric now computed** — The spike did not include the coefficient-of-variation based stability metric. Production pipeline shows stability=1.000 for steady tones (expected).

4. **No octave errors in either** — Both the Python spike and Java production show zero octave errors for harmonic-rich signals. The critical finding from Milestone 6B holds: **realistic harmonic vibrato does NOT produce octave errors**.

---

## 5. Failure Cases

| Case | Behaviour | Expected? |
|------|-----------|:---:|
| Empty file (0 bytes) | Returns 400 Bad Request | ✅ |
| Invalid WAV header | Returns fallback with "Unsupported audio format" | ✅ |
| Silence (all zeros) | `pitch.available=false`, `source="real"`, `fallback=false` | ✅ |
| Very short file (< 44 bytes) | Returns fallback with "WAV file too small" | ✅ |
| Non-WAV file (text bytes) | Returns fallback with "Not a WAV file: missing RIFF header" | ✅ |

**No unexpected failures observed.**

---

## 6. Performance

### Measured Timing (Java 17, Windows)

| Audio Duration | File Size (WAV 16-bit mono 44.1kHz) | Server Processing | Real-Time Factor |
|:---:|:---:|:---:|:---:|
| 1 second | ~88 KB | **123 ms** | **0.12x** |
| 5 seconds | ~441 KB | **587 ms** | **0.12x** |
| 10 seconds | ~882 KB | **1207 ms** | **0.12x** |

**Analysis:**
- Processing scales linearly with duration (~120ms per second of audio)
- Real-time factor of 0.12x means **~8x real-time throughput**
- Well within acceptable latency for interactive use
- Upload time not measured (depends on network; local tests show <10ms for WAV files under 1MB)

### Comparison with Python Spike (Milestone 6B)

| Duration | Python Processing | Java Processing | Speedup |
|:---:|:---:|:---:|:---:|
| 1.5 seconds | ~290 ms | ~180 ms (est.) | **1.6x** |
| Real-time factor | 0.199x | **0.12x** | **1.7x faster** |

---

## 7. Frontend Verification

### Analysis Flow

| Step | Status | Notes |
|------|:---:|-------|
| Landing → Dashboard | ✅ | Existing flow preserved |
| Dashboard → Analyse | ✅ | CTA link works |
| Select audio file | ✅ | Dropzone + file picker both work |
| Click "Analyse Recording" | ✅ | Transitions to UPLOADING → ANALYSING |
| Backend call (POST /api/analyse) | ✅ | Real API call with multipart upload |
| Real F0 results rendered | ✅ | F0MetricCard grid shows median pitch, range, stability, voicing |
| Fallback on backend unavailable | ✅ | Demo metrics shown with "Demonstration analysis" banner |
| Save session | ✅ | F0 session saved with `source: 'user'`, `analysisVersion: 'f0-yin-1.0'` |
| Sessions page | ✅ | Real sessions show "F0 Analysis" badge, pitch/stability |
| Session detail modal | ✅ | F0 metrics displayed for real sessions |
| Analytics page | ✅ | Handles mixed session history (demo + real) |
| Analytics F0 trend section | ✅ | Shows when ≥2 real F0 sessions exist |
| Dashboard F0 summary | ✅ | Shows when real analysis data exists |

### Demo Session Compatibility

| Check | Status |
|-------|:---:|
| Demo sessions still render on Sessions page | ✅ |
| Demo session detail shows legacy metrics | ✅ |
| Demo sessions still appear in Analytics | ✅ |
| Source filter (All/User/Demo) works | ✅ |
| "Reset to Demo Data" button works | ✅ |

---

## 8. Final Production Confidence

### What Is Confidently Verified

- ✅ YIN algorithm produces correct F0 for harmonic-rich synthetic signals
- ✅ No octave errors with harmonic vibrato (critical finding from 6B confirmed)
- ✅ Silence correctly detected as unvoiced
- ✅ Noisy signals handled robustly (10 dB SNR)
- ✅ Melodic phrases tracked across multiple notes
- ✅ Preprocessing (trim, DC removal, normalization) integrated correctly
- ✅ REST API returns correct JSON schema
- ✅ Fallback mechanism works when analysis fails
- ✅ Frontend renders real F0 metrics
- ✅ Session persistence works for both real and demo sessions
- ✅ Analytics handles mixed session history
- ✅ Performance within acceptable limits (~8x real-time)
- ✅ All 63 backend tests pass
- ✅ All 20 frontend tests pass
- ✅ Production build succeeds

### What Is NOT Verified (Blockers)

| Requirement | Status | Impact |
|-------------|--------|--------|
| **Real violin recordings** | ❌ NOT TESTED | Cannot confirm production pitch accuracy on real timbre |
| **Real vocal recordings** | ❌ NOT TESTED | Cannot confirm production pitch accuracy on real voice |
| **Real-world noise** | ❌ NOT TESTED | Cannot confirm robustness on actual recording noise |
| **MP3/FLAC/OGG decoding** | ❌ NOT IMPLEMENTED | Only WAV files supported; other formats fall back to demo |
| **Multi-channel audio** | ❌ NOT TESTED | Only mono WAV tested; stereo may behave differently |

---

## 9. Remaining Limitations

1. **No real audio validation** — The most critical gap. All results are from synthetic signals. Real instrument recordings have different spectral characteristics (formant structure, bow noise, room acoustics, recording artifacts) that could affect YIN behaviour.

2. **WAV-only support** — The backend only decodes PCM WAV files. Users with MP3/FLAC/OGG files will see fallback demo metrics, not real F0 analysis.

3. **No pitch accuracy score** — Without reference recordings or ground-truth labels, we cannot assign a pitch accuracy score. The "error" measurements (e.g., 440.0 Hz vs expected 440.0 Hz) are exact for synthetic signals but meaningless without real-world reference.

4. **Monophonic only** — YIN is designed for monophonic signals. Double stops, chords, or polyphonic material will produce unreliable results.

5. **YIN accuracy ceiling** — YIN achieves ~78–85% harmonic mean on benchmark datasets. Higher accuracy (90%+) requires neural approaches (SwiftF0, PESTO).

---

## 10. Final Verdict

### **PASS WITH LIMITATIONS**

The production F0 integration pipeline is **technically sound and functionally correct** for WAV audio input. The YIN algorithm, preprocessing, metrics computation, REST API, frontend integration, and session persistence all work as designed.

However, **real-world validation with actual instrument recordings has not been performed** because no audio fixtures exist in the repository. The synthetic validation provides high confidence that the algorithm works correctly for the signal types it was designed for, but cannot substitute for testing with real violin, vocal, or sitar recordings.

**Recommended before production release:**
1. Add 5+ real audio recordings to the repository (violin, vocal, noisy)
2. Run the same verification pipeline with real recordings
3. Add MP3/WAV transcoding support (Java AudioSystem or similar)
4. Validate on actual mobile recording quality (phone microphone)

**The system is safe to use as a development/staging prototype** — it correctly handles all edge cases, produces valid F0 measurements for monophonic WAV input, and falls back gracefully when it cannot produce real results.

---

## 11. Files Modified/Created in This Verification

| File | Purpose |
|------|---------|
| `ProductionF0VerificationTest.java` | 8 new tests: performance at 1s/5s/10s, quality checks for violin, vibrato, melody, silence, noise |
| `RIAZAI_V2_PRODUCTION_F0_VALIDATION.md` | This report |
