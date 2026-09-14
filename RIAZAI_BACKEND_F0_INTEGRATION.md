# RIAZAI_BACKEND_F0_INTEGRATION.md

## Architecture
The F0 analysis is integrated into the Spring Boot backend via a dedicated service layer that orchestrates the reconstructed YIN pipeline.

**Flow**: `AnalysisController` $\rightarrow$ `AudioAnalysisService` $\rightarrow$ `F0Pipeline` $\rightarrow$ (`WavDecoder` $\rightarrow$ `AudioPreprocessor` $\rightarrow$ `YinPitchDetector` $\rightarrow$ `F0DerivedMetrics`).

## API Contract

### POST `/api/analyse`
**Request**: `multipart/form-data`
- `audioFile`: WAV file (up to 10 MB)

**Response**: `200 OK`
```json
{
  "analysisVersion": "2.0.0-YIN",
  "audio": {
    "durationSeconds": 1.0,
    "sampleRate": 44100.0,
    "sampleCount": 44100
  },
  "pitch": {
    "available": true,
    "medianHz": 440.0,
    "rangeHz": 0.5,
    "stability": 0.98,
    "voicingRatio": 1.0,
    "frameCount": 86
  },
  "processing": {
    "processingTimeMs": 120,
    "pipeline": "YIN-v2"
  },
  "feedback": {}
}
```

### GET `/api/health`
**Response**: `200 OK`
```json
{ "status": "ok" }
```

## Implementation Details
- **F0 Pipeline**: Uses reconstructed YIN with local-minimum selection.
- **Preprocessing**: DC offset removal $\rightarrow$ Normalization $\rightarrow$ Silence trimming (threshold 0.01).
- **YIN Config**: Frame size 2048, Hop size 512, Voicing threshold 0.15, Freq range 60-2000 Hz.
- **Metrics**: Median Hz, Stability ($1 - \text{StdDev}/\text{Range}$), Voicing Ratio.

## Error Handling
- **Empty Files**: `400 Bad Request`
- **Unsupported Formats**: `405 Unsupported Media Type`
- **Malformed WAV**: `400 Bad Request`
- **No Voiced Material**: `pitch.available = false` with feedback.

## Verification Results
- **440 Hz Pure Tone**: Pass ($\approx 440 \text{ Hz}$)
- **Silence**: Pass (`available: false`)
- **Noisy/Unsupported**: Pass (correct error codes)
- **Full Suite**: All 8 tests passed.

## Performance
- **1s Audio**: $\approx 100\text{--}200 \text{ ms}$
- **Real-time Factor**: $\approx 0.1\text{--}0.2$ (highly efficient)

## Limitations
- Supports only monophonic signed PCM WAV files.
- No octave correction implemented.
- Fixed window sizes (not adaptive).
