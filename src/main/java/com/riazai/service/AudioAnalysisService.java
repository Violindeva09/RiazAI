package com.riazai.service;

import com.riazai.model.PerformanceMetrics;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AudioAnalysisService {

    public PerformanceMetrics analysePractice(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        if (bytes.length == 0) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        double averageAmplitude = normalisedAverage(bytes);
        double variance = normalisedVariance(bytes, averageAmplitude);

        double accuracy = roundTwoDecimals(60 + averageAmplitude * 40);
        double stability = roundTwoDecimals(55 + Math.max(0, 1 - variance) * 45);
        double consistency = roundTwoDecimals((accuracy * 0.55) + (stability * 0.45));

        List<Double> trend = buildTrend(consistency);
        String feedback = buildFeedback(accuracy, stability, consistency);

        return new PerformanceMetrics(accuracy, stability, consistency, trend, feedback);
    }

    double normalisedAverage(byte[] bytes) {
        double sum = 0;
        for (byte b : bytes) {
            sum += Math.abs(b);
        }
        return (sum / bytes.length) / 127.0;
    }

    double normalisedVariance(byte[] bytes, double averageAmplitude) {
        double avg = averageAmplitude * 127.0;
        double sumSquared = 0;
        for (byte b : bytes) {
            double diff = Math.abs(b) - avg;
            sumSquared += diff * diff;
        }
        return Math.min(1.0, (sumSquared / bytes.length) / (127.0 * 127.0));
    }

    List<Double> buildTrend(double currentConsistency) {
        List<Double> trend = new ArrayList<>();
        double base = Math.max(20, currentConsistency - 12);
        for (int i = 0; i < 6; i++) {
            trend.add(roundTwoDecimals(Math.min(100, base + (i * 2.4))));
        }
        return trend;
    }

    String buildFeedback(double accuracy, double stability, double consistency) {
        if (consistency > 85) {
            return "Excellent session. Your pitch control and note steadiness are strong—keep this routine and increase tempo gradually.";
        }
        if (accuracy < 75) {
            return "Focus on slow alankar patterns with a tanpura reference to improve pitch placement before speed work.";
        }
        if (stability < 75) {
            return "Sustain each note for longer counts and monitor breath/voice support to improve stability.";
        }
        return "Good progress. Alternate technical drills with one expressive piece to maintain consistency and musicality.";
    }

    private double roundTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
