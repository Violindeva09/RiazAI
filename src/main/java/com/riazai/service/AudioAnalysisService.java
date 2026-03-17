package com.riazai.service;

import com.riazai.model.PerformanceMetrics;
import com.riazai.model.PracticeSession;
import com.riazai.repository.PracticeSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
public class AudioAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(AudioAnalysisService.class);
    private final PracticeSessionRepository repository;

    public AudioAnalysisService(PracticeSessionRepository repository) {
        this.repository = repository;
    }

    public PerformanceMetrics analysePractice(MultipartFile file) throws IOException {
        logger.info("Starting audio analysis for file: {}", file.getOriginalFilename());
        byte[] bytes = file.getBytes();
        if (bytes.length == 0) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        double averageAmplitude = normalisedAverage(bytes);
        double variance = normalisedVariance(bytes, averageAmplitude);

        double accuracy = roundTwoDecimals(60 + averageAmplitude * 40);
        double stability = roundTwoDecimals(55 + Math.max(0, 1 - variance) * 45);
        double consistency = roundTwoDecimals((accuracy * 0.55) + (stability * 0.45));

        // Save to database
        PracticeSession session = new PracticeSession(file.getOriginalFilename(), accuracy, stability, consistency);
        repository.save(session);
        logger.debug("Saved session results to database for file: {}", file.getOriginalFilename());

        List<Double> trend = buildTrend();
        logger.info("Analysis complete for file: {}. Consistency: {}%", file.getOriginalFilename(), consistency);
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

    List<Double> buildTrend() {
        List<Double> scores = repository.findRecentConsistencyScores(PageRequest.of(0, 6));
        Collections.reverse(scores); // Show oldest to newest
        return scores;
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
