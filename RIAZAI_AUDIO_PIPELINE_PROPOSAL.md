# RIAZAI Audio Pipeline Proposal

## 1. Proposed Architecture
The RiazAI pipeline is designed to transition from a simple DSP baseline (MVP) to a high-accuracy neural engine (Production) without changing the API contract.

### End-to-End Data Flow
`Audio File` $\rightarrow$ `Format Decode` $\rightarrow$ `Preprocessing` $\rightarrow$ `F0 Estimation` $\rightarrow$ `F0 Cleanup` $\rightarrow$ `Derived Metrics` $\rightarrow$ `AnalysisResponse` $\rightarrow$ `UI`

---

## 2. Detailed Pipeline Stages

| Stage | Input | Output | Recommended Tool | Why it's needed | Status | Difficulty | Future Path |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Format Decode** | Multipart File | PCM float[] | **FFmpeg / TarsosDSP** | Support MP3, M4A, WAV | Missing | Low | Cloud-based decode |
| **2. Preprocessing** | Raw PCM | Clean PCM | **Custom Java** | DC offset removal, Mono conv, Norm | Missing | Low | Adaptive Noise Reduc. |
| **3. F0 Estimation** | Clean PCM | Raw F0 Frames | **YIN (MVP) $\rightarrow$ SwiftF0** | Extract fundamental frequency | Spike Only | Med | PESTO (Microtonal) |
| **4. F0 Cleanup** | Raw F0 Frames | Filtered F0 | **Median Filter** | Remove octave jumps/glitches | Missing | Low | HMM / pYIN smoothing |
| **5. Derived Metrics**| Filtered F0 | Metric Object | **Custom Java** | Stability, Voicing Ratio, Range | Spike Only | Low | Intonation vs. Reference |
| **6. Response Map** | Metric Object | JSON Response | **Spring Boot** | Map to API contract for React | Missing | Low | Pedagogical Feedback |

---

## 3. Technical Specifications for MVP (YIN-based)

### Analysis Parameters
- **Sample Rate**: 44,100 Hz
- **Frame Size**: 2,048 samples ($\sim$46ms) - ensures coverage of low-frequency notes (down to 60Hz).
- **Hop Size**: 512 samples ($\sim$11ms) - provides high temporal resolution for vibrato.
- **Frequency Range**: 60 Hz to 2,000 Hz (covers violin/vocal range).

### Metric Definitions
1. **Pitch Stability**: $1 - (\text{StdDev} / \text{Range})$, clamped to $[0, 1]$.
2. **Voicing Ratio**: $\text{Count}(\text{Voiced Frames}) / \text{Total Frames}$.
3. **Median Pitch**: The median F0 of all voiced frames.

---

## 4. Deployment Strategy: "The Wrapper Pattern"
To avoid overengineering, we will implement the `AudioAnalysisService` as an interface.

- **`YinAnalysisEngine`**: The current spike implementation. Fast, zero-dependency.
- **`SwiftF0AnalysisEngine`**: Future implementation using ONNX Runtime. High accuracy.

The `PracticeController` will interact with the interface, allowing the engine to be swapped via a configuration property (`analysis.engine=yin|swiftf0`) without touching the API or Frontend.

## 5. Complexity Assessment
- **Implementation Effort**: Low-Medium.
- **Risk**: Low. The most complex part is the audio decoding; the F0 logic is already proven in the spike.
- **Maintenance**: High. By keeping the engine decoupled from the controller, we avoid technical debt when moving to neural models.
