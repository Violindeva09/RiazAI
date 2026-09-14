# RIAZAI_V2_YIN_440HZ_DEBUG.md

## Problem Description
The reconstructed YIN pitch detector exhibited a consistent frequency drift when analyzing a pure 440 Hz sine wave. Instead of the expected ~440 Hz, the algorithm returned ~428 Hz.

## Diagnostic Evidence
- **Sample Rate**: 44100 Hz
- **Target Frequency**: 440 Hz
- **Expected Lag ($\tau$):** $44100 / 440 \approx 100.227$
- **CMNDF Analysis**: A trace of the Cumulative Mean Normalized Difference Function (CMNDF) showed a clear global minimum at $\tau = 100$ with a value near $0$.
- **Failure Point**: The algorithm was selecting $\tau = 91$ as the candidate.
- **Selection Logic**: The implementation was returning the **first** $\tau$ that fell below the `voicingThreshold` (0.15). Since `cmndf[91]` was $0.145$, the search terminated immediately.
- **Interpolation Error**: Parabolic interpolation performed on $\tau = 91$ (where the curve was still steeply descending) overcorrected the lag to $\approx 103$, leading to the $428 \text{ Hz}$ result.

## Root Cause
**Incorrect Selection Logic (Threshold Crossing vs. Local Minimum)**.
The algorithm identified the crossing point of the threshold as the pitch candidate, rather than using the threshold to identify a candidate region and then searching for the actual local minimum within that region.

## Corrective Action
Modified `YinPitchDetector.estimatePitch` to implement a two-stage selection:
1. **Crossing**: Find the first $\tau$ where `cmndf[tau] < voicingThreshold`.
2. **Minimum Search**: Continue iterating $\tau$ while `cmndf[tau + 1] < cmndf[tau]`.
3. **Interpolation**: Apply parabolic interpolation to the resulting local minimum.

## Results
### 440 Hz Pure Tone
- **Expected $\tau$**: 100.227
- **Threshold-crossing $\tau$**: 91
- **Final local-minimum $\tau$**: 100
- **Interpolated $\tau$**: $\approx 100.23$
- **Resulting Frequency**: $\approx 440 \text{ Hz}$
- **Error**: $< 1\%$ (Passes test)

### Regression & Suite Results
- **Silence Test**: Pass
- **Noise Test**: Pass
- **Backend Test Suite**: All tests green.

## Final Conclusion
The issue was a deviation from the YIN algorithm specification regarding local minimum selection. The correction restores the expected behavior and accuracy for pure tones.
