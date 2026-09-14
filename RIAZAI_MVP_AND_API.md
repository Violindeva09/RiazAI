# RIAZAI MVP Definition & API Contract

## 1. MVP Definition (V2)
The goal of the MVP is to replace simulated frontend data with a real, functioning audio-to-metrics pipeline.

### Included in MVP
- **Audio Upload**: Single file upload via `POST /api/analyse`.
- **Audio Decoding**: Basic WAV support (via `javax.sound.sampled`).
- **F0 Analysis**: Custom YIN implementation (from the spike).
- **Pitch Metrics**: Median Hz, Range, Stability, Voicing Ratio.
- **Session History**: Frontend-side persistence (localStorage).
- **Health Check**: `GET /api/health` for backend availability.

### Excluded from MVP (Future/Optional)
- **Multi-format Support**: MP3/M4A (requires FFmpeg/heavy libs).
- **Onset Detection**: Note start/end detection.
- **Tempo/Beat Tracking**: Rhythmic analysis.
- **Reference Comparison**: Accuracy relative to a specific Raga/Note.
- **Database**: Backend session persistence (keep it simple).
- **Authentication**: User accounts.

---

## 2. REST API Contract

### Endpoint: `POST /api/analyse`
**Request**:
- `Content-Type`: `multipart/form-data`
- `audioFile`: File (binary)

**Response (JSON)**:
```json
{
  "analysisVersion": "yin-v1",
  "audio": {
    "sampleRate": 44100,
    "durationSeconds": 12.5,
    "channels": 1
  },
  "pitch": {
    "available": true,
    "medianHz": 440.1,
    "rangeHz": 4.2,
    "stability": 0.92,
    "voicingRatio": 0.88,
    "f0FrameCount": 1080
  },
  "metrics": {
    "overallScore": null,
    "stabilityLabel": "Steady"
  },
  "processing": {
    "computationTimeMs": 45,
    "algorithm": "YIN"
  }
}
```

### Field Definitions
| Field | Type | Definition |
| :--- | :--- | :--- |
| `medianHz` | Float | The median fundamental frequency of voiced frames. |
| `rangeHz` | Float | `maxHz - minHz` of voiced frames. |
| `stability` | Float | $1 - (\text{StdDev} / \text{Range})$, scale $[0, 1]$. |
| `voicingRatio` | Float | $\text{Voiced Frames} / \text{Total Frames}$. |
| `stabilityLabel`| String | Human-readable mapping (e.g., $\ge 0.8$ $\rightarrow$ "Steady"). |

### Endpoint: `GET /api/health`
**Response**:
```json
{
  "status": "UP",
  "engine": "YIN"
}
```
