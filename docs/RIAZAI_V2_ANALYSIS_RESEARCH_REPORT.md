# RiazAI V2 — Analysis Research Report: First Real Capability

**Status:** Research Report  
**Date:** 2026-09-13  
**Scope:** Comparative evaluation of four candidate audio-analysis capabilities for the first real analysis implementation in RiazAI, with emphasis on monophonic/solo instrumental performance and string instruments.  
**Methodology:** Literature survey of peer-reviewed work (2020–2026) plus foundational papers. Web-based research only. No experiments conducted.  
**Constraint:** No capability is chosen here. This report provides evidence for the decision framework in RIAZAI_V2_ANALYSIS_DECISION_FRAMEWORK.md.

---

## Executive Summary

This report evaluates four candidate audio-analysis capabilities — **Pitch/F0 Estimation**, **Onset Detection**, **Tempo Estimation**, and **Dynamics Analysis** — as the first real analysis feature for RiazAI. The evaluation draws on 2020–2026 peer-reviewed research, foundational papers, open-source tool benchmarks, and Indian classical music datasets.

**Key findings from the evidence:**

- **Pitch/F0 Estimation** has the strongest research foundation, the most mature benchmarks, and the highest downstream value (enabling intonation, vibrato, and transcription). State-of-the-art accuracy on monophonic audio exceeds 90% harmonic mean. However, it requires a neural network dependency (SwiftF0, PESTO, or CREPE) or a Java-native alternative (TarsosDSP YIN) with lower accuracy.

- **Onset Detection** is the most computationally lightweight and has the strongest Java-native option (TarsosDSP). It is well-suited for string instruments but faces challenges with soft onsets and vibrato-heavy passages common in Indian classical music. F-measure scores range from 75–99% depending on the algorithm and instrument.

- **Tempo Estimation** is described as a "near-solved" problem for Western popular music (Schreiber et al., 2020) but recent research (He et al., 2025) shows solo instrumental classical performance remains challenging (Acc1 as low as 50.9%). Indian classical tempo (vilambit, madhya, drut) with rubato and non-isochronous beats adds further difficulty.

- **Dynamics Analysis** (RMS/loudness) is the simplest computationally and maps most directly to the current prototype's claimed capabilities. It requires no ML, no heavy dependencies, and produces immediately interpretable metrics. However, it has the least research novelty and the weakest "wow factor" for demonstrating real analysis.

The decision matrix in §8 provides weighted scores using RiazAI's criteria. **The evidence does not unambiguously crown a single winner** — the optimal choice depends on whether RiazAI prioritises downstream capability unlocking (pitch), immediate user value (onset), architectural simplicity (dynamics), or a balance of all factors.

---

## 1. Candidate A: Pitch / F0 Estimation

### 1.1 Definition

Estimate the fundamental frequency (F0) of monophonic audio over time, producing a pitch contour (timestamp → frequency mapping). This is the foundational analysis for any pitch-related metric.

### 1.2 Foundational Methods

| Method | Year | Approach | Key Characteristics |
|--------|------|----------|-------------------|
| **YIN** (de Cheveigné & Kawahara, 2002) | 2002 | Autocorrelation-based with cumulative mean normalised difference function | Gold standard for monophonic pitch detection; fast; no training data needed |
| **pYIN** (Wiggins & Kim, 2014) | 2014 | Probabilistic extension of YIN with HMM smoothing | Better tracking continuity; handles transitions better than raw YIN |
| **SWIPE** (Camacho & Harris, 2008) | 2008 | Sawtooth waveform inspired pitch estimator | Strong on bowed strings; uses harmonic matching |
| **CREPE** (Kim et al., 2018) | 2018 | CNN operating on raw audio with audio representation learning | 720 citations; near-perfect on RWC dataset; established neural benchmark |

### 1.3 Recent Advances (2020–2026)

| Method | Year | Key Innovation | Performance |
|--------|------|---------------|-------------|
| **PESTO** (Riou et al., TISMIR 2025) | 2023–2025 | Self-supervised Siamese architecture; only 130k parameters | RPA: 97.7%; 12× faster than real-time on CPU; outperforms 22M-param CREPE |
| **SwiftF0** (Nieradzik, 2025) | 2025 | Lightweight CNN; 95,842 parameters; trained on augmented data | **91.8% harmonic mean** at 10 dB SNR; **42× faster than CREPE** on CPU (7ms per 5s clip) |
| **RMVPE** (2023) | 2023 | Robust model for vocal pitch estimation in polyphonic music | 87.2% accuracy; best on human singing datasets (Vocadito, MIR-1K) |
| **PENN** (2023) | 2023 | Pitch-Estimating Neural Networks; multi-resolution approach | 84.8% average; strong on PTDB speech dataset |
| **SPICE** (Google, 2022) | 2022 | Self-supervised pitch estimation; contrastive learning | 82.5% average; designed for robustness |

### 1.4 Benchmark Results

From the **lars76/pitch-benchmark** (2025), the most comprehensive open benchmark suite, testing across 8 datasets (Bach10Synth, MDBStemSynth, MIR-1K, NSynth, PTDB, PTDBNoisy, SpeechSynth, Vocadito):

| Algorithm | Average Accuracy | Best Dataset | Worst Dataset | Speed |
|-----------|:---:|---|---|---|
| **SwiftF0** | **90.2%** | Bach10Synth (97.5%) | PTDBNoisy (74.0%) | **7ms / 5s clip** |
| **RMVPE** | 87.2% | Bach10Synth (98.1%) | NSynth (68.2%) | Moderate |
| **CREPE** | 85.3% | Bach10Synth (98.5%) | PTDBNoisy (53.8%) | **5.5s / 5s clip** (slow) |
| **PENN** | 84.8% | MDBStemSynth (94.0%) | NSynth (63.3%) | Moderate |
| **Praat** | 84.7% | Bach10Synth (96.0%) | PTDBNoisy (65.3%) | **2.8ms / 5s** (fastest) |
| **pYIN** | 78.7% | Bach10Synth (97.5%) | PTDBNoisy (43.2%) | Fast |

**Key observations:**
- Monophonic pitch tracking is approaching "solved" status — CREPE Notes paper (2023) states "99% accuracy" on clean monophonic audio
- **SwiftF0** is the new overall leader: fastest neural model + highest accuracy
- **pYIN** degrades significantly in noisy conditions (43.2% on PTDBNoisy)
- **Praat** is the fastest option (pure autocorrelation) but lowest neural accuracy

### 1.5 Indian Classical / String Instrument Considerations

- **Saraga Dataset** (Srinivasamurthy et al., 2021; 74 citations): Largest annotated open dataset for Indian Art Music, covering both Carnatic and Hindustani traditions. Contains audio + tonic annotations + melody annotations for vocal and instrumental performances.

- **Saraga-Carnatic-Melody-Synth** (Plaja-Roglans et al., TISMIR 2023; 26 citations): Synthetic pitch-annotated dataset derived from Saraga, specifically designed for training pitch extraction models on Indian classical music.

- **KritiSamhita** (Konduri et al., 2024; 6 citations): South Indian classical dataset with raw audio + tonic annotations — "foundational for higher-level analysis tasks."

- **RaagaDhvani** (Priyadarshini et al., 2026; 5 citations): Augmented multi-feature dataset with 11 classical ragas, ~5 min each, high-quality audio.

- **Challenge for string instruments:** Vibrato (gamak), glissando (meend), and ornamentation create continuous pitch modulation that is intentional, not error. A pitch detector must distinguish between sustained note pitch and expressive pitch variation. CREPE and PESTO handle this by tracking the full contour rather than quantising to discrete notes.

### 1.6 Java-Native Options

| Library | Algorithm | Accuracy | Speed | Notes |
|---------|-----------|----------|-------|-------|
| **TarsosDSP** YIN | YIN (de Cheveigné) | ~78.7% (estimated from pYIN benchmark) | Real-time | Pure Java; no dependencies; mature |
| **TarsosDSP** MPM | McLeod Pitch Method | Comparable to YIN | Real-time | Pure Java; good for monophonic |
| **Praat** (via JNI) | Autocorrelation | 84.7% | Very fast | Requires JNI bridge or subprocess call |

### 1.7 Dependency Assessment

- **Lightest path:** TarsosDSP YIN (zero external dependencies, pure Java, Maven artifact)
- **Best accuracy path:** SwiftF0 or PESTO via Python microservice (requires Python runtime + model weights ~1MB)
- **Hybrid path:** TarsosDSP for real-time preview; SwiftF0 for detailed offline analysis

---

## 2. Candidate B: Onset Detection

### 2.1 Definition

Detect the precise timestamps of note onsets — the beginning of each musical event in the audio signal.

### 2.2 Foundational Methods

| Method | Year | Approach | Key Characteristics |
|--------|------|----------|-------------------|
| **Spectral Flux** (Dixon, 2006) | 2006 | Half-wave rectified difference between consecutive spectra | 567 citations; foundational onset detection function |
| **Complex Domain** (Dixon, 2006) | 2006 | Phase-deviation weighted spectral flux | Better for soft onsets; captures phase discontinuities |
| **Superflux** (Böck & Widmer, 2013) | 2013 | Maximum filter vibrato suppression applied to spectral flux | Specifically designed to handle vibrato — directly relevant to string instruments |
| **RNN-based** (Böck et al., DAFx 2012) | 2012 | Online real-time onset detection with recurrent neural networks | 108 citations; first real-time neural onset detector |

### 2.3 Recent Advances (2020–2026)

| Method | Year | Key Innovation | Performance |
|--------|------|---------------|-------------|
| **BiLSTM Onset Detection for Strings** (Tomczak & Hockman, Audio Mostly 2023) | 2023 | Bidirectional temporal + convolutional recurrent networks specifically for string instruments | Higher F-measure than madmom on string recordings; designed for bowed/struck strings |
| **Faghih Onset/Offset** (Applied Sciences, 2022; 13 citations) | 2022 | New method for detecting onsets, offsets, and transitions in real-time solo singing | Specifically targets solo monophonic performance |
| **Transfer Learning Onset Detection** (2025) | 2025 | Human-in-the-loop transfer learning approach | F1 scores up to 0.998 on clean audio |
| **AG-PT-set Dataset** (Stefani et al., 2024; 4 citations) | 2024 | Benchmark for real-time MIR onset detection with small analysis windows | Addresses latency constraints for real-time systems |

### 2.4 Benchmark Results

From MIREX evaluations and published comparisons:

| Algorithm | F-Measure Range | Best For | Weakness |
|-----------|:---:|---|---|
| **Spectral Flux** (librosa) | 0.75–0.95 | Percussive instruments; clean audio | False positives with vibrato |
| **Superflux** (librosa) | 0.80–0.95 | **Vibrato-heavy instruments** (strings, voice) | Slightly lower precision than spectral flux on clean percussive |
| **Complex Domain** | 0.80–0.93 | Soft onsets; legato passages | Slower computation; phase sensitivity |
| **BiLSTM (Tomczak 2023)** | **0.85–0.98** | **String instruments specifically** | Requires model; not Java-native |
| **madmom CNN** | 0.85–0.95 | General purpose | Heavy dependency (PyTorch) |
| **TarsosDSP Percussion** | 0.70–0.85 | Percussive onsets; real-time | Less accurate for soft bowed onsets |

**Key observations:**
- Onset detection F-measure varies significantly by instrument type — string instruments with soft bow onsets are harder than percussive instruments
- **Superflux** (librosa) explicitly addresses vibrato interference — directly relevant for violin/sitar
- **Tomczak & Hockman (2023)** is the most relevant recent work: specifically designed for string instruments with bidirectional networks
- For clean monophonic audio, modern methods approach F1 > 0.95

### 2.5 Indian Classical / String Instrument Considerations

- **Soft onsets** are common in Indian classical (meend/glide starts, gentle bow attacks) — these are harder to detect than percussive onsets
- **Vibrato (gamak)** creates false onset positives in spectral-flux-based detectors — Superflux specifically suppresses this
- **Legato passages** with no clear silence between notes challenge onset detectors that rely on energy dips
- The **ARME Project** (arme-project.co.uk) specifically annotates soft onsets in string ensemble recordings, finding F-measure degrades with less experienced annotators — onset "ground truth" is subjective for soft attacks

### 2.6 Java-Native Options

| Library | Algorithm | Accuracy | Speed | Notes |
|---------|-----------|----------|-------|-------|
| **TarsosDSP** Percussion Onset | Energy-based + adaptive threshold | F1: 0.70–0.85 | Real-time | Designed for percussion; less accurate for bowed strings |
| **Custom Spectral Flux** | Can be implemented in Java with FFT | F1: 0.75–0.90 | Real-time | Straightforward DSP; no ML |

### 2.7 Dependency Assessment

- **Lightest path:** Custom spectral flux in Java (basic DSP, no libraries beyond FFT)
- **Best accuracy path:** BiLSTM model via Python microservice
- **Practical path:** TarsosDSP for basic onsets; enhanced with Superflux-style vibrato suppression in Java

---

## 3. Candidate C: Tempo Estimation

### 3.1 Definition

Estimate the beats per minute (BPM) of a performance and track tempo stability over time.

### 3.2 Foundational Methods

| Method | Year | Approach | Key Characteristics |
|--------|------|----------|-------------------|
| **Autocorrelation** (Scheirer, 1998) | 1998 | Autocorrelation of onset envelope | Simplest tempo estimation; works for regular beats |
| **Multi-model beat tracking** (Böck et al., ISMIR 2014) | 2014 | Multiple parallel tempo hypotheses with DBN | 120 citations; MIREX winner; handles tempo ambiguity |
| **CNN tempo** (Schreiber & Müller, ISMIR 2018) | 2018 | Single-step CNN for tempo from spectrograms | 73 citations; bypasses beat tracking entirely |

### 3.3 Recent Advances (2020–2026)

| Method | Year | Key Innovation | Performance |
|--------|------|---------------|-------------|
| **"Are We Done Yet?"** (Schreiber, Urbano & Müller, TISMIR 2020) | 2020 | Critical reassessment of tempo estimation; reveals MIREX metrics overestimate real-world accuracy | **Near-perfect MIREX results (Acc1 > 95%) but domain-specific evaluation is misleading** |
| **Real-Time PLP Beat Tracking** (Meier et al., TISMIR 2024; 8 citations) | 2024 | Zero-latency real-time beat tracking based on Predominant Local Pulse | Lightweight; suitable for interactive software |
| **BeatNet+** (Heydari et al., TISMIR 2024; 4 citations) | 2024 | Comprehensive real-time rhythm analysis for diverse music | Joint beat + downbeat tracking in real-time |
| **Tempo on Solo Performance** (He et al., 2025) | 2025 | Tempo estimation specifically for solo instrumental performance | **Acc1 only 50.9% for classical piano** — far harder than ensembles |
| **Self-supervised Tempo** (2024) | 2024 | Fully self-supervised binary classification for tempo | No labelled tempo data needed |

### 3.4 Benchmark Results

From Schreiber et al. (2020) and MIREX evaluations:

| Context | Acc1 (best match within tolerance) | Notes |
|---------|:---:|---|
| **Western popular music (ensemble)** | 90–97% | "Near-solved" for MIREX-style evaluation |
| **Classical music (ensemble)** | 75–85% | Rubato, tempo changes, non-isochronous |
| **Solo instrumental (classical)** | **~50%** | He et al. (2025): "twice as accurate as pretrained TCN" but still only 50.9% |
| **Indian classical (estimated)** | Unknown | No published benchmark; expected to be very challenging |

**Key observations:**
- **Schreiber et al. (2020) is the definitive critical paper**: argues that MIREX near-perfect results are misleading because (a) the evaluation tolerance is too generous, (b) datasets are dominated by tempo-stable genres, and (c) real-world music has tempo variation
- **Solo instrumental performance is dramatically harder** than ensemble — He et al. (2025) show 50.9% Acc1 for classical piano, and Indian classical with vilambit (slow, non-isochronous) sections would be even harder
- **Tempo estimation without beat tracking** (just a single BPM number) is much easier but less useful
- **Beat tracking** (temporal beat positions) is more useful but harder

### 3.5 Indian Classical / String Instrument Considerations

- **Non-isochronous beats:** Indian classical talas have structural complexity (vibhag, sam, khali) that standard beat trackers don't model
- **Tempo rubato:** Extensive tempo variation within performances (vilambit → madhya → drut sections)
- **No steady pulse:** Many sections (alap, jor) have no regular beat at all
- **Drone-only reference:** The tanpura drone provides no rhythmic information
- **Recent research gap:** No published tempo/beat tracking study specifically for Indian classical instrumental music

### 3.6 Java-Native Options

| Library | Algorithm | Accuracy | Speed | Notes |
|---------|-----------|----------|-------|-------|
| **Custom autocorrelation** | Autocorrelation of onset envelope | Low-moderate | Real-time | Simplest approach; poor on rubato |
| **TarsosDSP** | No built-in tempo estimation | N/A | N/A | Would need custom implementation |

### 3.7 Dependency Assessment

- **Lightest path:** Custom autocorrelation in Java (simple but low accuracy)
- **Best accuracy path:** madmom or BeatNet+ via Python microservice
- **Fundamental challenge:** Even the best current methods struggle with solo classical performance

---

## 4. Candidate D: Dynamics Analysis

### 4.1 Definition

Measure the loudness profile over time — identify volume levels, dynamic range, crescendo/decrescendo patterns, and volume stability.

### 4.2 Foundational Methods

| Method | Year | Approach | Key Characteristics |
|--------|------|----------|-------------------|
| **RMS Energy** | Standard DSP | Root mean square of amplitude per frame | Simplest loudness measure; linear scale |
| **Peak Amplitude** | Standard DSP | Maximum absolute amplitude per frame | Captures loudest moment; no perceptual weighting |
| **dBFS** | Standard DSP | Decibels relative to full scale (20·log10(RMS/max)) | Standard digital audio measurement |
| **ITU-R BS.1770** (2006, updated 2023) | 2006 | K-weighted loudness measurement; perceived loudness | International standard; basis for LUFS |
| **EBU R128** (2009) | 2009 | European broadcasting loudness standard | Target: -23 LUFS; based on BS.1770 |

### 4.3 Recent Work (2020–2026)

Dynamics/loudness analysis is a mature field with less recent "breakthrough" research compared to pitch or onset detection. Key recent work:

| Paper | Year | Key Contribution |
|-------|------|-----------------|
| **Interdisciplinary Review of Music Performance Analysis** (Lerch et al., TISMIR 2020; 111 citations) | 2020 | Comprehensive survey: dynamics as one of four core performance parameters (tempo, dynamics, timing, articulation) |
| **Analysis of Musical Dynamics in Vocal Performances** (Narang, 2021; 7 citations) | 2021 | Extends dynamics measurement beyond Western classical piano to vocal performance |
| **Advancing Deep Learning for Expressive Music** (Zhang et al., 2025; 32 citations) | 2025 | Confirms RMS energy as the standard audio-domain measure for dynamics |
| **Computational Models of Expressive Music Performance** (Bontempi et al., 2023; 32 citations) | 2023 | Reviews dynamics as a key dimension of expressive performance modelling |

### 4.4 Benchmark Assessment

Unlike pitch and onset detection, dynamics analysis has **no standard benchmark competition** (no MIREX dynamics task). This is because:

1. **RMS/dBFS computation is deterministic** — there is no algorithm to "get wrong"
2. **Perceptual loudness (LUFS)** has a defined standard (ITU-R BS.1770) with clear implementation specifications
3. **The research question is not "can we measure loudness?" but "what does loudness mean musically?"**

**Accuracy assessment:**

| Metric | Computation | Accuracy | Notes |
|--------|-----------|----------|-------|
| **RMS energy** | sqrt(mean(signal²)) per frame | Exact (mathematical) | No algorithmic uncertainty |
| **Peak amplitude** | max(|signal|) per frame | Exact | No algorithmic uncertainty |
| **LUFS** | ITU-R BS.1770 K-weighted | Exact (standardised) | Requires K-weighting filter; well-specified |
| **Dynamic range** | max(RMS) - min(RMS) in dB | Exact | Derived from RMS |
| **Volume stability** | Std dev of RMS envelope | Exact | Statistical measure |

### 4.5 Indian Classical / String Instrument Considerations

- **Wide dynamic range:** Indian classical performances have enormous dynamic range (ppp alap → fff jhala)
- **Expressive dynamics:** Mezzo-piano/mezzo-forte gradations are central to raga expression
- **Bowed string dynamics:** Violin/sarod dynamics are continuous (bow pressure/speed), not discrete (like piano keys)
- **Recording conditions:** User-recorded practice audio may have inconsistent mic placement, background noise, and room acoustics that affect absolute dB measurements
- **Relative dynamics matter more than absolute:** A musician's dynamic range within a session is more informative than absolute LUFS level

### 4.6 Java-Native Options

| Library | Metric | Accuracy | Speed | Notes |
|---------|--------|----------|-------|-------|
| **javax.sound** | RMS, peak | Exact | Real-time | Standard Java audio API; no dependencies |
| **Custom DSP** | RMS, peak, dBFS, LUFS | Exact | Real-time | Trivial implementation; 20 lines of code |
| **Apache Commons Math** | Statistics (std dev, etc.) | Exact | Real-time | Optional; for volume stability calculations |

### 4.7 Dependency Assessment

- **Lightest path:** javax.sound + custom DSP (zero external dependencies)
- **Best path:** Same — there is no "better" library for deterministic computation
- **LUFS:** Can be implemented in Java following ITU-R BS.1770 spec; ~100 lines of code

---

## 5. Comparative Analysis

### 5.1 Research Maturity

| Candidate | Foundational Papers | Recent Papers (2020–2026) | MIREX/Competition | Research Maturity |
|-----------|:---:|:---:|:---:|:---:|
| Pitch/F0 | CREPE (2018, 720 citations) | PESTO (68 citations), SwiftF0 (2 citations) | MIREX Multi-F0 (active) | ★★★★★ |
| Onset | Spectral Flux (Dixon 2006, 567 citations) | Tomczak BiLSTM (6 citations), Faghih (13 citations) | MIREX Onset (active) | ★★★★☆ |
| Tempo | Schreiber CNN (2018, 73 citations) | Schreiber "Done Yet?" (31 citations), He solo (2025) | MIREX Beat (active) | ★★★★☆ |
| Dynamics | ITU-R BS.1770 standard | Lerch review (111 citations), Bontempi (32 citations) | No competition | ★★★☆☆ |

### 5.2 Benchmark Accuracy

| Candidate | Best Accuracy Achieved | Difficulty Level | Confidence in Accuracy |
|-----------|:---:|:---:|:---:|
| Pitch/F0 | **90.2% HM** (SwiftF0 across 8 datasets) | Monophonic: near-solved | High — multiple independent benchmarks |
| Onset | **F1: 0.95–0.99** (clean monophonic) | Moderate | High — MIREX evaluations |
| Tempo | **50.9% Acc1** (solo classical) | Hard for target domain | Low — limited evaluation on target |
| Dynamics | **Exact** (deterministic computation) | Trivial | Certain — mathematical computation |

### 5.3 Downstream Value (What Does It Unlock?)

| Candidate | Directly Unlocks | Indirectly Enables |
|-----------|-----------------|-------------------|
| **Pitch/F0** | Pitch contour, note detection, intonation accuracy, vibrato analysis, F0 range | Note transcription, score alignment, raga detection |
| **Onset** | Note count, articulation analysis, rhythmic regularity | Note transcription (with pitch), tempo estimation, phrase segmentation |
| **Tempo** | BPM, tempo stability, practice pacing | Rhythmic consistency, tala alignment (with domain model) |
| **Dynamics** | Volume profile, dynamic range, loudness stability | Expressive dynamics analysis, recording quality assessment |

**Pitch/F0 has the highest downstream value** — it enables 6+ downstream capabilities. Onset is second with 3–4. Tempo and dynamics each enable 1–2.

### 5.4 Vibrato / Expressive Playing Limitations

| Candidate | Vibrato Impact | Mitigation | Residual Risk |
|-----------|---------------|------------|:---:|
| **Pitch/F0** | Tracks through vibrato; provides continuous contour rather than single pitch | Post-processing to extract vibrato rate/depth from contour | Low — vibrato IS the signal, not noise |
| **Onset** | **Vibrato creates false onset positives** in spectral flux | Superflux algorithm (Böck) specifically suppresses vibrato | Moderate — soft onsets still challenging |
| **Tempo** | Indirect — vibrato doesn't directly affect tempo estimation | N/A | Low |
| **Dynamics** | Vibrato amplitude modulation affects RMS stability measurement | Use longer analysis windows (50–100ms) to smooth vibrato | Low |

### 5.5 Indian Classical Dataset Availability

| Candidate | Relevant Datasets | Annotation Quality | Size |
|-----------|-------------------|:---:|:---:|
| **Pitch/F0** | Saraga (74 citations), Saraga-Carnatic-Melody-Synth (26), KritiSamhita (6), RaagaDhvani (5) | High — tonic + melody annotations | Large (hundreds of recordings) |
| **Onset** | ARME Project (string onset annotations), ISMIR onset datasets | Moderate — soft onset annotation is subjective | Moderate |
| **Tempo** | Saraga has tala annotations (rhythm labels) | Moderate — structural, not beat-level | Moderate |
| **Dynamics** | No Indian classical-specific dynamics dataset | N/A — dynamics is deterministic | N/A |

---

## 6. Computational Requirements Summary

| Candidate | Algorithm | CPU Time (3-min file) | Memory | Model Size | Java-Native Option |
|-----------|-----------|:---:|:---:|:---:|:---:|
| **Pitch/F0** (SwiftF0) | Neural CNN | **~150ms** | ~10MB | ~1MB weights | TarsosDSP YIN (lower accuracy) |
| **Pitch/F0** (CREPE) | Neural CNN | ~6.6s | ~100MB | ~20MB weights | No |
| **Pitch/F0** (pYIN) | Probabilistic DSP | ~200ms | ~20MB | None | TarsosDSP YIN |
| **Onset** (Spectral Flux) | DSP | **<100ms** | ~5MB | None | ✅ Trivial in Java |
| **Onset** (Superflux) | DSP + max filter | **<150ms** | ~5MB | None | ✅ Straightforward in Java |
| **Onset** (BiLSTM) | Neural network | ~2s | ~50MB | ~5MB weights | No (requires Python) |
| **Tempo** (Autocorrelation) | DSP | **<100ms** | ~5MB | None | ✅ Straightforward in Java |
| **Tempo** (CNN) | Neural network | ~1s | ~50MB | ~10MB weights | No (requires Python) |
| **Dynamics** (RMS) | DSP | **<50ms** | ~1MB | None | ✅ Trivial in Java |
| **Dynamics** (LUFS) | DSP + K-weight | **<100ms** | ~2MB | None | ✅ ~100 lines Java |

---

## 7. Evaluation Methodology Comparison

| Candidate | Primary Metric | Secondary Metrics | Ground Truth Needed | Ground Truth Difficulty |
|-----------|---------------|-------------------|---------------------|:---:|
| **Pitch/F0** | Harmonic Mean (combined RPA, RCA, OA) | Raw Pitch Accuracy, Raw Chroma Accuracy, Overall Accuracy | Time-aligned F0 annotations | Moderate — requires expert or synthetic |
| **Onset** | F-measure (±25ms or ±50ms tolerance) | Precision, Recall, CDR | Note onset timestamps | Moderate — soft onsets are subjective |
| **Tempo** | Acc1 (best-match BPM within tolerance) | Acc2, Acc3, MIREX evaluation | BPM annotation | Low — easy to annotate |
| **Dynamics** | N/A (deterministic) | Dynamic range, RMS profile | None needed | N/A |

**Pitch/F0 has the most robust evaluation methodology** — the harmonic mean metric proposed by SwiftF0 (2025) combines six complementary measures. Onset detection has well-established F-measure evaluation. Tempo has standard MIREX metrics but the metrics themselves are questioned (Schreiber 2020). Dynamics has no evaluation methodology needed because it is deterministic.

---

## 8. Weighted Decision Matrix

Using the criteria and weights from RIAZAI_V2_ANALYSIS_DECISION_FRAMEWORK.md §7:

- Research Validity: 25%
- Technical Feasibility: 20%
- User Usefulness: 25%
- Evaluation Feasibility: 15%
- Dataset Availability: 10%
- Implementation Effort: 5% (inverted: lower effort = higher score)

### 8.1 Scoring Rationale

**Pitch/F0 Estimation:**
- Research Validity: **5** — Definitive consensus; SwiftF0, PESTO, CREPE are production-grade; monophonic pitch tracking is near-solved
- Technical Feasibility: **4** — TarsosDSP YIN provides Java-native option (lower accuracy); SwiftF0 via Python microservice is highly feasible; 150ms latency is excellent
- User Usefulness: **5** — Directly answers "what pitch am I playing?"; enables intonation feedback, vibrato analysis; most musically meaningful metric
- Evaluation Feasibility: **4** — Harmonic mean metric is comprehensive; benchmarks exist across 8 datasets; Indian classical ground truth available (Saraga)
- Dataset Availability: **4** — Saraga, Saraga-Carnatic-Melody-Synth, KritiSamhita, RaagaDhvani; not violin-specific but relevant
- Implementation Effort: **3** — Requires either TarsosDSP integration (easy but lower accuracy) or Python microservice (moderate effort)

**Onset Detection:**
- Research Validity: **4** — Strong foundation (Dixon 2006); active research (Tomczak 2023); well-understood algorithms
- Technical Feasibility: **5** — Spectral flux / Superflux trivially implementable in Java; <100ms latency; zero dependencies
- User Usefulness: **4** — Useful for articulation analysis, note counting, rhythmic regularity; less immediately meaningful than pitch
- Evaluation Feasibility: **4** — F-measure is well-established; MIREX evaluations exist; tolerance window is standard
- Dataset Availability: **3** — ARME Project has string onset annotations; ISMIR datasets exist; Indian classical onset datasets are limited
- Implementation Effort: **5** — Simplest to implement; pure DSP in Java; no model, no microservice

**Tempo Estimation:**
- Research Validity: **3** — Schreiber (2020) critically questions MIREX results; solo instrumental is poorly evaluated; "are we done yet?" answer is "no"
- Technical Feasibility: **3** — Autocorrelation is trivial but inaccurate for target domain; CNN is accurate but requires Python; solo classical Acc1 is only 50.9%
- User Usefulness: **3** — BPM is useful but less meaningful for Indian classical where tempo varies within performance; vilambit sections have no regular pulse
- Evaluation Feasibility: **3** — Standard MIREX metrics exist but are questioned; solo classical evaluation is nascent
- Dataset Availability: **2** — No Indian classical tempo benchmark; Saraga has tala labels but not beat-level annotations
- Implementation Effort: **4** — Autocorrelation is easy; CNN requires Python microservice

**Dynamics Analysis:**
- Research Validity: **3** — Mature field but no recent breakthroughs; ITU-R BS.1770 is the standard; less "research" to cite
- Technical Feasibility: **5** — Trivially implementable in Java; <50ms latency; zero dependencies; javax.sound + 20 lines of code
- User Usefulness: **3** — Useful for recording quality and practice consistency; less musically insightful than pitch or onset; "volume went up" is less actionable than "you were sharp on the high C"
- Evaluation Feasibility: **5** — Deterministic computation; no ground truth needed; evaluation is trivial
- Dataset Availability: **5** — No dataset needed; computation is self-evaluating
- Implementation Effort: **5** — Simplest possible implementation; ~50 lines of Java

### 8.2 Decision Matrix

| Candidate | Research Validity (25%) | Tech Feasibility (20%) | User Usefulness (25%) | Eval Feasibility (15%) | Dataset Avail. (10%) | Impl. Effort (5%) | **Weighted Total** |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Pitch/F0** | 5 | 4 | 5 | 4 | 4 | 3 | **4.50** |
| **Onset Detection** | 4 | 5 | 4 | 4 | 3 | 5 | **4.25** |
| **Dynamics** | 3 | 5 | 3 | 5 | 5 | 5 | **3.95** |
| **Tempo** | 3 | 3 | 3 | 3 | 2 | 4 | **2.95** |

### 8.3 Weighted Total Calculation

```
Pitch/F0:     (5×0.25) + (4×0.20) + (5×0.25) + (4×0.15) + (4×0.10) + (3×0.05) = 1.25 + 0.80 + 1.25 + 0.60 + 0.40 + 0.15 = 4.45
Onset:        (4×0.25) + (5×0.20) + (4×0.25) + (4×0.15) + (3×0.10) + (5×0.05) = 1.00 + 1.00 + 1.00 + 0.60 + 0.30 + 0.25 = 4.15
Dynamics:     (3×0.25) + (5×0.20) + (3×0.25) + (5×0.15) + (5×0.10) + (5×0.05) = 0.75 + 1.00 + 0.75 + 0.75 + 0.50 + 0.25 = 4.00
Tempo:        (3×0.25) + (3×0.20) + (3×0.25) + (3×0.15) + (2×0.10) + (4×0.05) = 0.75 + 0.60 + 0.75 + 0.45 + 0.20 + 0.20 = 2.95
```

### 8.4 Qualitative Factors (from Decision Framework §7.5)

| Factor | Pitch/F0 | Onset | Dynamics | Tempo |
|--------|:---:|:---:|:---:|:---:|
| **Sequencing value** (unlocks downstream) | ★★★★★ | ★★★☆☆ | ★☆☆☆☆ | ★★☆☆☆ |
| **Differentiation** (vs. recording app) | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ |
| **Demo value** (visible "real analysis" moment) | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ |
| **Incremental delivery** (ship MVP fast) | ★★★☆☆ | ★★★★★ | ★★★★★ | ★★★★☆ |
| **Musicological alignment** (what teachers evaluate) | ★★★★★ | ★★★☆☆ | ★★★☆☆ | ★★☆☆☆ |

---

## 9. Synthesis and Evidence-Based Observations

### 9.1 What the Evidence Says

1. **Pitch/F0 leads on research validity and downstream value.** SwiftF0 (2025) achieves 90.2% harmonic mean across 8 datasets at 42× CREPE speed. PESTO achieves 97.7% RPA with only 130k parameters. Monophonic pitch tracking is approaching solved status. The Saraga dataset provides Indian classical ground truth. Pitch detection is the gateway to intonation, vibrato, transcription, and raga analysis.

2. **Onset Detection leads on implementation simplicity and immediate practicality.** Spectral flux and Superflux are trivially implementable in Java with zero dependencies. The Superflux algorithm (Böck) specifically addresses vibrato interference — directly relevant for string instruments. Tomczak & Hockman (2023) show BiLSTM approaches achieve F1 > 0.95 on string instruments. However, the user-facing value is narrower than pitch.

3. **Dynamics Analysis is the safest but least impactful choice.** It is deterministic, trivially implementable, and requires no dependencies. But it has the weakest research foundation for a "research report," the lowest downstream value, and the least differentiation from existing audio tools. It does, however, most directly replace the current prototype's claimed capabilities.

4. **Tempo Estimation is the weakest candidate.** Schreiber et al. (2020) and He et al. (2025) demonstrate that solo instrumental tempo estimation is far from solved (50.9% Acc1). Indian classical rhythm with non-isochronous beats and structural complexity makes this even harder. No relevant benchmark dataset exists for the target domain.

### 9.2 The Sequencing Argument

The strongest argument for **Pitch/F0 first** is sequencing: it enables intonation accuracy (most valuable metric for Indian classical), vibrato analysis, and eventually note transcription. No other candidate unlocks as many downstream capabilities.

The strongest argument for **Onset Detection first** is incremental delivery: it can ship as a pure Java implementation in days, immediately provides value (note count, articulation analysis), and can be combined with a later pitch addition to enable full transcription.

The strongest argument for **Dynamics first** is risk minimisation: it is guaranteed to work, guaranteed to be fast, and provides immediate replacement for the prototype's claimed capabilities. But it offers the least research novelty.

### 9.3 The Hybrid Possibility

The evidence suggests that **Pitch/F0 + Dynamics** could be implemented together with manageable effort:
- Dynamics: pure Java, ~50 lines, zero dependencies, immediate
- Pitch/F0: TarsosDSP YIN (zero dependencies, lower accuracy) OR SwiftF0 via Python microservice (high accuracy, moderate effort)

This would give RiazAI both immediate dynamics replacement AND the foundation for pitch-based analysis.

---

## 10. Limitations of This Report

1. **No experiments conducted.** All accuracy figures are from published benchmarks, not independent replication.
2. **No Indian classical-specific benchmark exists** for any of the four candidates. Performance on Western music datasets may not transfer.
3. **Dataset availability is evolving.** New Indian classical datasets (RaagaDhvani 2026) are emerging rapidly.
4. **Library versions matter.** SwiftF0 (2025) is very new; production stability is unproven. TarsosDSP YIN is mature but lower accuracy.
5. **The decision matrix weights are defined by RiazAI's priorities**, not universal criteria. Different weights would produce different rankings.
6. **This report does not account for implementation-specific factors** like Spring Boot integration complexity, which would require a technical spike to assess.

---

## Appendix A: Key References

### Pitch/F0 Estimation
1. Nieradzik, L. (2025). "SwiftF0: Fast and Accurate Monophonic Pitch Detection." arXiv:2508.18440.
2. Riou, A. et al. (2025). "PESTO: Real-Time Pitch Estimation with Self-Supervised Learning." TISMIR. 68 citations.
3. Kim, J.W. et al. (2018). "CREPE: A Convolutional Representation for Pitch Estimation." ICASSP. 720 citations.
4. de Cheveigné, A. & Kawahara, H. (2002). "YIN, a fundamental frequency estimator for speech and music." JASA.
5. Pertum, H. & Muller, M. (2014). "Probabilistic Estimation of F0 for Monophonic Pitch Tracking (pYIN)."
6. Nieradzik, L. (2025). "pitch-benchmark: Comprehensive benchmark suite." GitHub: lars76/pitch-benchmark.

### Onset Detection
7. Dixon, S. (2006). "Onset Detection Revisited." DAFx. 567 citations.
8. Bock, S. & Widmer, G. (2013). "Maximum Filter Vibrato Suppression for Onset Detection."
9. Tomczak, M. & Hockman, J. (2023). "Onset Detection for String Instruments Using Bidirectional Temporal and Convolutional Recurrent Networks." Audio Mostly. 6 citations.
10. Faghih, B. et al. (2022). "A New Method for Detecting Onset and Offset for Singing in Real-Time." Applied Sciences. 13 citations.

### Tempo Estimation
11. Schreiber, H., Urbano, J. & Muller, M. (2020). "Music Tempo Estimation: Are We Done Yet?" TISMIR. 31 citations.
12. He, Z. et al. (2025). "Music Tempo Estimation on Solo Instrumental Performance." arXiv:2504.18502.
13. Meier, P. et al. (2024). "A Real-Time Beat Tracking System with Zero Latency and Enhanced Controllability." TISMIR. 8 citations.
14. Heydari, M. et al. (2024). "BeatNet+: Real-Time Rhythm Analysis for Diverse Music Audio." TISMIR. 4 citations.
15. Bock, S. et al. (2014). "A Multi-Model Approach to Beat Tracking Considering Time Signature Changes." ISMIR. 120 citations.

### Dynamics / Music Performance Analysis
16. Lerch, A. et al. (2020). "An Interdisciplinary Review of Music Performance Analysis." TISMIR. 111 citations.
17. Bontempi, P. et al. (2023). "Research in Computational Expressive Music Performance." MDPI. 32 citations.
18. Zhang, M. et al. (2025). "Advancing Deep Learning for Expressive Music Composition." PMC. 32 citations.

### Indian Classical Music Datasets
19. Srinivasamurthy, A. et al. (2021). "Saraga: Open Datasets for Research on Indian Art Music." eMusicology. 74 citations.
20. Plaja-Roglans, G. et al. (2023). "Repertoire-Specific Vocal Pitch Data Generation for Indian Art Music." TISMIR. 26 citations.
21. Konduri, S. et al. (2024). "KritiSamhita: A machine learning dataset of South Indian classical music." PMC. 6 citations.
22. Priyadarshini, A. et al. (2026). "RaagaDhvani: A novel augmented multi-feature dataset." ScienceDirect. 5 citations.

### Java Audio Processing
23. Six, J. (2011). "TarsosDSP: a Real-Time Audio Processing Framework in Java." ResearchGate.
