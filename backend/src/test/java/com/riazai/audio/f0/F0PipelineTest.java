package com.riazai.audio.f0;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

public class F0PipelineTest {

    @Test
    public void testPureTone440Hz() {
        float sampleRate = 44100f;
        double freq = 440.0;
        int durationMs = 1000;
        double[] samples = generateSineWave(freq, sampleRate, durationMs);

        YinPitchDetector detector = new YinPitchDetector(sampleRate, 2048, 512, 0.15, 60.0, 2000.0);
        List<F0Frame> frames = detector.detect(samples);

        double median = F0DerivedMetrics.compute(frames).medianHz();
        
        // Expect within 1% error
        assertTrue(Math.abs(median - freq) < (freq * 0.01), 
            "Median frequency " + median + " should be close to " + freq);
        assertTrue(frames.stream().anyMatch(f -> f.voiced()), "Should detect voiced frames");
    }

    @Test
    public void testSilence() {
        float sampleRate = 44100f;
        double[] samples = new double[44100]; // 1s of zeros

        YinPitchDetector detector = new YinPitchDetector(sampleRate, 2048, 512, 0.15, 60.0, 2000.0);
        List<F0Frame> frames = detector.detect(samples);

        F0DerivedMetrics.Result metrics = F0DerivedMetrics.compute(frames);
        assertEquals(0, metrics.voicedFrames(), "Silence should have 0 voiced frames");
        assertEquals(0, metrics.voicingRatio(), 0.001);
    }

    @Test
    public void testNoise() {
        float sampleRate = 44100f;
        double[] samples = new double[44100];
        Random rand = new Random();
        for (int i = 0; i < samples.length; i++) {
            samples[i] = rand.nextDouble() * 2 - 1;
        }

        YinPitchDetector detector = new YinPitchDetector(sampleRate, 2048, 512, 0.15, 60.0, 2000.0);
        List<F0Frame> frames = detector.detect(samples);

        F0DerivedMetrics.Result metrics = F0DerivedMetrics.compute(frames);
        // Noise should have very low voicing ratio
        assertTrue(metrics.voicingRatio() < 0.2, "White noise should have low voicing ratio");
    }

    private double[] generateSineWave(double freq, float sampleRate, int durationMs) {
        int numSamples = (int) (sampleRate * durationMs / 1000.0);
        double[] samples = new double[numSamples];
        for (int i = 0; i < numSamples; i++) {
            samples[i] = Math.sin(2 * Math.PI * freq * i / sampleRate);
        }
        return samples;
    }
}
