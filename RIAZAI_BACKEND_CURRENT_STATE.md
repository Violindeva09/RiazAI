# RIAZAI Backend Current State Report

## 1. Current Architecture
The system is currently a **disconnected hybrid**:
- **Frontend**: A fully featured React + Tailwind application that relies on hardcoded `demoData.js` for its dashboard and analytics, and a simulated analysis flow in `Analyse.jsx`.
- **Backend**: Physically missing from the working tree but recoverable from Git history. The recoverable version is a Spring Boot Maven prototype.
- **Analysis Logic**: Existing as an "F0 Spike" (documented in `docs/RIAZAI_V2_F0_SPIKE.md`), which implements a pure Java YIN algorithm for pitch detection.

## 2. Existing Components (Recoverable/Documented)
- **Endpoints (Recoverable)**:
    - `POST /api/analyse`: (Intended) Upload audio, return analysis.
    - `GET /api/health`: (Intended) Health check.
- **Models (Recoverable)**:
    - `PerformanceMetrics.java`: Basic structure for analysis results.
- **Services (Recoverable/Spike)**:
    - `AudioAnalysisService.java`: Recoverable prototype.
    - `YinPitchDetector.java`: (Spike) Core F0 extraction logic.
    - `F0DerivedMetrics.java`: (Spike) Logic for stability, median Hz, etc.
- **F0 Implementation**:
    - Custom YIN algorithm (pure Java) providing raw F0 frames and derived metrics (median, range, stability, voicing ratio).

## 3. Missing Backend Components
- **Physical Files**: All `backend/` and `src/` files are missing from the current directory.
- **Audio Decoding**: No robust multi-format decoder (currently assumes WAV or raw samples in the spike).
- **Preprocessing**: Missing DC offset removal, normalization, and silence trimming.
- **Persistence**: No database implementation; sessions are currently handled by the frontend via `localStorage`.
- **CORS Configuration**: Not configured for the React frontend (localhost:3000 -> localhost:8080).

## 4. Broken Dependencies/Imports
- **Frontend -> Backend**: `frontend/src/services/api.js` is configured to call `/api/analyse` and `/api/health`, but no server is running to respond.
- **Build System**: `pom.xml` is missing, preventing any Java compilation or test execution.

## 5. Audio-Processing Limitations
- **Monophonic Only**: YIN cannot handle double stops or polyphony.
- **Format Support**: Limited to WAV in the spike implementation.
- **Timbre**: No analysis of tone quality, vibrato depth (beyond F0 variance), or articulation.

## 6. Requirements for End-to-End Functionality
To make RiazAI runnable end-to-end, the following must be achieved:
1. **Restore Files**: Checkout `backend/` and `src/` from Git.
2. **Integrate Spike**: Move `com.riazai.spike.f0` logic into the production `AudioAnalysisService`.
3. **Implement API Contract**: Ensure `PracticeController` returns the JSON structure expected by `frontend/src/services/api.js`.
4. **Add Decoder**: Integrate a library (e.g., TarsosDSP or a Java-compatible decoder) to handle MP3/WAV.
5. **Enable CORS**: Add a `WebMvcConfigurer` to allow requests from the React dev server.
6. **Connect Frontend**: Update `Analyse.jsx` to use `uploadForAnalysis` from `api.js` instead of demo data.
