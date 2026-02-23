package com.riazai.service;

import com.riazai.model.PerformanceMetrics;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AudioAnalysisServiceTest {

    private final AudioAnalysisService service = new AudioAnalysisService();

    @Test
    void analysePracticeReturnsMetricsWithinRange() throws IOException {
        byte[] bytes = new byte[]{0, 20, -20, 45, -45, 100, -100};
        MockMultipartFile file = new MockMultipartFile("audioFile", "test.wav", "audio/wav", bytes);

        PerformanceMetrics metrics = service.analysePractice(file);

        assertThat(metrics.accuracyPercentage()).isBetween(60.0, 100.0);
        assertThat(metrics.noteStability()).isBetween(55.0, 100.0);
        assertThat(metrics.consistencyScore()).isBetween(57.0, 100.0);
        assertThat(metrics.trendSeries()).hasSize(6);
        assertThat(metrics.personalisedFeedback()).isNotBlank();
    }

    @Test
    void analysePracticeRejectsEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("audioFile", "empty.wav", "audio/wav", new byte[]{});

        assertThatThrownBy(() -> service.analysePractice(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("empty");
    }
}
