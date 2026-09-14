# RIAZAI Audio Algorithm Research Report

## 1. Technical Pipeline Research

### A. Audio Decoding & Preprocessing
To support a professional practice platform, the pipeline must handle diverse formats and clean the signal before pitch estimation.

**Recommended Pipeline:**
1. **Decoding**: Use **FFmpeg** (via wrapper) or **TarsosDSP** for Java. For pure Java, `javax.sound.sampled` handles WAV, but external libraries are needed for MP3/M4A.
2. **Preprocessing**:
   - **Mono Conversion**: Average channels to ensure monophonic input.
   - **Resampling**: Standardize to 44.1 kHz or 22.05 kHz (SwiftF0/CREPE often prefer specific rates).
   - **DC Offset Removal**: Subtract mean of the signal to prevent YIN difference function bias.
   - **Normalization**: Peak normalize to -1dB to ensure consistent voicing detection.
   - **Silence Trimming**: Remove leading/trailing silence using an energy threshold (RMS).

### B. Fundamental Frequency (F0) Estimation
The research identifies a clear trade-off between DSP-based and Neural-based approaches.

| Algorithm | Type | Accuracy | Latency | Note |
| :--- | :--- | :--- | :--- | :--- |
| **YIN** | DSP | Moderate | Very Low | Foundational, zero-dependency, best for solo tones. |
| **pYIN** | Probabilistic| High | Moderate | Improved YIN with Hidden Markov Model (HMM) for continuity. |
| **CREPE** | Neural | Very High | High | Convolutional representation; gold standard for accuracy but heavy. |
| **SwiftF0** | Neural | High | Low | 2025 state-of-the-art; 42x faster than CREPE, outperforms pYIN. |
| **PESTO** | Neural | Very High | Moderate | Self-supervised; excellent for microtonal/ethnic music variations. |

**Key Research Findings:**
- **SwiftF0 (2025)**: Represents the best balance of speed and accuracy for monophonic pitch detection in 2026.
- **Violin Suitability**: Neural models (CREPE/SwiftF0) handle the complex harmonic structure of bowed strings and vibrato significantly better than YIN.
- **Microtonality**: PESTO is specifically noted for its ability to handle microtonal variations in ethnic music, making it highly relevant for Indian Classical music (Ragas).

### C. Derived Pitch Metrics
To move from "measurement" to "analysis," the following metrics are required:

- **Pitch Stability**: Measured as the Inverse of the Coefficient of Variation ($1 - \frac{\sigma}{\mu}$) or the standard deviation of F0 over a sustained note.
- **Voicing Ratio**: $\frac{\text{Voiced Frames}}{\text{Total Frames}}$, indicating how much of the recording contains a detectable pitch.
- **F0 Continuity**: The number of octave jumps or sudden discontinuities, used to detect "glitches" or unstable bowing.
- **Frequency Deviation**: $\text{Abs}(\text{Detected F0} - \text{Reference F0})$. Requires a reference note/raga.

## 2. Prioritized Sources & Citations

### Foundational & Recent Research
1. **SwiftF0 (2025)**: *SwiftF0: Fast and Accurate Monophonic Pitch Detection*. L. Nieradzik. arXiv:2508.18440.
   - **Relevance**: Recommended as the primary engine for RiazAI due to its speed and accuracy.
2. **dYIN/dSWIPE (2025)**: *Differentiable variants of classical fundamental frequency estimators*. S. Strahl & M. Müller. IEEE Transactions on Audio, Speech and Signal Processing.
   - **Relevance**: Validates that classical YIN is still a strong baseline, especially for violin recordings.
3. **CREPE (2018)**: *CREPE: A Convolutional Representation for Pitch Estimation*. J.W. Kim et al. IEEE.
   - **Relevance**: The benchmark for neural pitch tracking accuracy.
4. **PESTO (2026)**: *Analysis model for microtonal variations in ethnic music integrating the self-supervised PESTO algorithm*. R. Li. Discover Computing.
   - **Relevance**: Critical for handling the nuanced microtonality (Shrutis) of Indian Classical music.

## 3. Implementation Options Comparison

| Technology | Purpose | Language | License | Accuracy | Latency | Complexity | Rec. Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Custom YIN** | F0 | Java | Public | Mod | Low | Low | MVP / Baseline |
| **TarsosDSP** | Pipeline | Java | GPLv3 | Mod | Low | Low | Audio Pre-proc |
| **SwiftF0** | F0 | Python/ONNX| MIT | High | Low | Med | Production Engine |
| **CREPE** | F0 | Python/ONNX| MIT | V. High | High | Med | Offline Gold Standard|
| **PESTO** | F0 | Python/ONNX| MIT | V. High | Mod | Med | Ethnic/Raga Analysis |
| **Librosa** | Pre-proc | Python | BSD | High | Mod | Low | Research/Validation |

## 4. Final Recommendation for RiazAI
For a deployable, maintainable application:
- **Short Term (MVP)**: Use the **Custom Java YIN** implementation. It provides immediate value, has zero dependencies, and fits the existing Spring Boot architecture.
- **Medium Term (V2)**: Transition to **SwiftF0 via ONNX Runtime**. This allows the model to run in Java (via ONNX) or a lightweight Python service, providing a massive leap in accuracy for violin/vocal audio without the latency of CREPE.
- **Long Term**: Integrate **PESTO** for specialized Raga-based microtonal analysis.
