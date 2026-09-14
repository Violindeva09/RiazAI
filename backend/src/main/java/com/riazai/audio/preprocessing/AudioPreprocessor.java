package com.riazai.audio.preprocessing;

import java.util.Arrays;

/**
 * Basic audio preprocessing for F0 analysis.
 */
public class AudioPreprocessor {

    public static double[] removeDcOffset(double[] samples) {
        double sum = 0;
        for (double s : samples) sum += s;
        double mean = sum / samples.length;

        double[] cleaned = new double[samples.length];
        for (int i = 0; i < samples.length; i++) {
            cleaned[i] = samples[i] - mean;
        }
        return cleaned;
    }

    public static double[] normalize(double[] samples) {
        double max = 0;
        for (double s : samples) {
            max = Math.max(max, Math.abs(s));
        }

        if (max == 0) return samples;

        double[] normalized = new double[samples.length];
        for (int i = 0; i < samples.length; i++) {
            normalized[i] = samples[i] / max;
        }
        return normalized;
    }

    public static double[] trimSilence(double[] samples, double threshold) {
        int start = 0;
        while (start < samples.length && Math.abs(samples[start]) < threshold) {
            start++;
        }

        int end = samples.length - 1;
        while (end >= start && Math.abs(samples[end]) < threshold) {
            end--;
        }

        if (start > end) return new double[0];

        return Arrays.copyOfRange(samples, start, end + 1);
    }
}
