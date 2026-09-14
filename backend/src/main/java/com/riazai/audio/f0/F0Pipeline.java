package com.riazai.audio.f0;

import com.riazai.audio.preprocessing.AudioPreprocessor;
import com.riazai.audio.wav.WavDecoder;
import java.io.InputStream;
import java.util.List;

/**
 * Orchestrates the end-to-end F0 analysis pipeline.
 */
public class F0Pipeline {

    public record AnalysisResult(
        WavDecoder.AudioData audioInfo,
        List<F0Frame> frames,
        F0DerivedMetrics.Result metrics
    ) {}

    public static AnalysisResult analyze(InputStream audioStream) throws Exception {
        // 1. Decode
        WavDecoder.AudioData rawData = WavDecoder.decode(audioStream);
        double[] samples = rawData.samples();
        float sampleRate = rawData.sampleRate();

        // 2. Preprocess
        samples = AudioPreprocessor.removeDcOffset(samples);
        samples = AudioPreprocessor.normalize(samples);
        samples = AudioPreprocessor.trimSilence(samples, 0.01);

        // 3. F0 Estimation (YIN)
        YinPitchDetector detector = new YinPitchDetector(
            sampleRate, 
            2048, // frameSize
            512,  // hopSize
            0.15, // voicingThreshold
            60.0, // minFreq
            2000.0 // maxFreq
        );
        List<F0Frame> frames = detector.detect(samples);

        // 4. Derived Metrics
        F0DerivedMetrics.Result metrics = F0DerivedMetrics.compute(frames);

        return new AnalysisResult(rawData, frames, metrics);
    }
}
