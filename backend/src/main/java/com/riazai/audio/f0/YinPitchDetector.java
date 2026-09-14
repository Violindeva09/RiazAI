package com.riazai.audio.f0;

import java.util.*;

/**
 * Reconstructed YIN pitch detector based on de Cheveigné & Kawahara (2002).
 */
public class YinPitchDetector {

    private final float sampleRate;
    private final int frameSize;
    private final int hopSize;
    private final double voicingThreshold;
    private final double minFreq;
    private final double maxFreq;

    public YinPitchDetector(float sampleRate, int frameSize, int hopSize, double voicingThreshold, double minFreq, double maxFreq) {
        this.sampleRate = sampleRate;
        this.frameSize = frameSize;
        this.hopSize = hopSize;
        this.voicingThreshold = voicingThreshold;
        this.minFreq = minFreq;
        this.maxFreq = maxFreq;
    }

    public List<F0Frame> detect(double[] samples) {
        List<F0Frame> frames = new ArrayList<>();
        int numFrames = (samples.length - frameSize) / hopSize + 1;

        for (int f = 0; f < numFrames; f++) {
            int offset = f * hopSize;
            double[] frame = new double[frameSize];
            System.arraycopy(samples, offset, frame, 0, frameSize);

            double tau = estimatePitch(frame);
            double timestampMs = (offset + frameSize / 2.0) * 1000.0 / sampleRate;

            if (tau > 0) {
                double freq = sampleRate / tau;
                if (freq >= minFreq && freq <= maxFreq) {
                    double confidence = calculateConfidence(frame, tau);
                    frames.add(new F0Frame(timestampMs, freq, confidence, true));
                    continue;
                }
            }
            frames.add(new F0Frame(timestampMs, 0, 0, false));
        }
        return frames;
    }

    private double estimatePitch(double[] frame) {
        int tauMax = frameSize / 2;
        double[] df = differenceFunction(frame, tauMax);
        double[] cmndf = cumulativeMeanNormalizedDifference(df, tauMax);

        int tau = -1;
        for (int t = 1; t < tauMax; t++) {
            if (cmndf[t] < voicingThreshold) {
                tau = t;
                break;
            }
        }

        if (tau == -1) return -1;

        while (tau + 1 < tauMax && cmndf[tau + 1] < cmndf[tau]) {
            tau++;
        }

        return parabolicInterpolation(cmndf, tau);
    }

    private double[] differenceFunction(double[] frame, int tauMax) {
        double[] df = new double[tauMax];
        for (int tau = 1; tau < tauMax; tau++) {
            double diff = 0;
            for (int i = 0; i < frameSize - tau; i++) {
                double val = frame[i] - frame[i + tau];
                diff += val * val;
            }
            df[tau] = diff;
        }
        return df;
    }

    private double[] cumulativeMeanNormalizedDifference(double[] df, int tauMax) {
        double[] cmndf = new double[tauMax];
        double runningSum = 0;
        for (int tau = 1; tau < tauMax; tau++) {
            runningSum += df[tau];
            double mean = runningSum / tau;
            cmndf[tau] = df[tau] / (1.0 + mean);
        }
        return cmndf;
    }

    private double parabolicInterpolation(double[] cmndf, int tau) {
        if (tau <= 0 || tau >= cmndf.length - 1) return tau;
        double alpha = cmndf[tau - 1];
        double beta = cmndf[tau];
        double gamma = cmndf[tau + 1];
        
        double denominator = 2 * (alpha - 2 * beta + gamma);
        if (Math.abs(denominator) < 1e-9) return tau;
        
        return tau + (alpha - gamma) / (2 * (alpha - 2 * beta + gamma));
    }

    private double calculateConfidence(double[] frame, double tau) {
        int t = (int) Math.round(tau);
        if (t < 0 || t >= frameSize / 2) return 0;
        double[] df = differenceFunction(frame, frameSize / 2);
        double[] cmndf = cumulativeMeanNormalizedDifference(df, frameSize / 2);
        return Math.max(0, Math.min(1, 1.0 - cmndf[t]));
    }
}
