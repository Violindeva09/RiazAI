package com.riazai.model;

import java.util.List;

public record PerformanceMetrics(
        double accuracyPercentage,
        double noteStability,
        double consistencyScore,
        List<Double> trendSeries,
        String personalisedFeedback
) {
}
