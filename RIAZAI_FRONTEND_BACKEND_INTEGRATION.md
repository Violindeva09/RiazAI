# RIAZAI_FRONTEND_BACKEND_INTEGRATION.md

## Architecture
The frontend communicates with the Spring Boot backend using a multipart upload via the `uploadForAnalysis` service.

**Flow**: `Analyse.jsx` $\rightarrow$ `api.js` $\rightarrow$ `POST /api/analyse` $\rightarrow$ `AnalysisResponse` $\rightarrow$ `AnalysisResults.jsx`.

## API Client
- **Base URL**: Managed via `REACT_APP_API_BASE_URL` environment variable.
- **Service**: `src/services/api.js` handles `FormData` construction, request timeouts (30s), and error normalization into `ApiError`.
- **Health Check**: `checkBackendHealth()` verifies availability before attempting analysis.

## Response Mapping
The `AnalysisResponse` from the backend is mapped as follows:

| Backend Field | Frontend UI / Storage |
| :--- | :--- |
| `pitch.available` |- determines `isRealAnalysis` banner and result visibility |
| `pitch.medianHz` |- Median Pitch display |
| `pitch.rangeHz` |- Pitch Range display |
| `pitch.stability` |- Stability % (mapped to legacy `score`, `stability`, `consistency`) |
| `pitch.voicingRatio` |- Voicing Ratio % (mapped to legacy `accuracy`) |
| `audio.sampleRate` |- Sample Rate metadata |
| `processing.processingTimeMs`|- Processing Time metadata |
| `analysisVersion` |- Engine version badge |

## Session Mapping
Sessions saved from real analysis are marked with `source: "user"` and include `analysisVersion`. They are stored in `localStorage` and normalized by `storage.js` to maintain compatibility with legacy demo sessions.

## Local Run Instructions
1. **Backend**: `cd backend && ./mvnw.cmd spring-boot:run` (runs on port 8080).
2. **Frontend**: `cd frontend && npm start` (runs on port 3000).
3. **Env**: Ensure `REACT_APP_API_BASE_URL=http://localhost:8080` is set or use default.

## Known Limitations
- **Progress Bar**: Uses a transition-based state (`uploading` $\rightarrow$ `analysing`) since the current backend does not support upload progress events.
- **WAV Only**: Only monophonic WAV files are processed.
