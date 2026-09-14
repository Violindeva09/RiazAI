package com.riazai.audio.f0;

import java.util.List;
import java.util.OptionalDouble;

/**
 * Computes derived metrics from a sequence of F0 frames.
 */
public class F0DerivedMetrics {

    public record Result(
        int totalFrames,
        int voicedFrames,
        double voicingRatio,
        double medianHz,
        double meanHz,
        double minHz,
        double maxHz,
        double rangeHz,
        double stdDevHz,
        double pitchStability,
        double pitchCentreHz
    ) {}

    public static Result compute(List<F0Frame> frames) {
        if (frames == null || frames.isEmpty()) {
            return new Result(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }

        int total = frames.size();
        List<Double> voicedFrequencies = frames.stream()
                .filter(F0Frame::voiced)
                .map(F0Frame::frequencyHz)
                .toList();

        int voicedCount = voicedFrequencies.size();
        double ratio = (double) voicedCount / total;

        if (voicedCount == 0) {
            return new Result(total, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }

        double sum = 0;
        double min = Double.MAX_VALUE;
        double max = Double.MIN_VALUE;
        for (double f : voicedFrequencies) {
            sum += f;
            min = Math.min(min, f);
            max = Math.max(max, f);
        }

        double mean = sum / voicedCount;
        double range = max - min;
        
        double sumSqDiff = 0;
        for (double f : voicedFrequencies) {
            sumSqDiff += Math.pow(f - mean, 2);
        }
        double stdDev = Math.sqrt(sumSqDiff / voicedCount);

        // Stability: 1 - (stdDev / range), clamped to [0, 1]
        // Based on the spike report's stability definition
        double stability = 0;
        if (range > 0) {
            stability = Math.max(0, Math.min(1, 1 - (stdDev / range)));
        }

        // Median Hz
        double median = calculateMedian(voicedFrequencies);
        
        // Geometric Mean for Centre Hz
        double logSum = 0;
        for (double f : voicedFrequencies) {
            logSum += Math.log(f);
        }
        double centreHz = Math.exp(logSum / voicedCount);

        return new Result(
            total,
            voicedCount,
            ratio,
            median,
            mean,
            min,
            max,
            range,
            stdDev,
            stability,
            centreHz
        );
    }

    private static double calculateMedian(List<Double> values) {
        List<Double> sorted = values.stream().sorted().toList();
        int size = sorted.size();
        if (size % 2 == 0) {
            return (sorted.get(size / 2 - 1) + sorted.get(size / 2)) / 2.0;
        } else {
            return sorted.get(size / 2);
        }
    }
}
