package com.riazai.service;

import com.riazai.model.PerformanceMetrics;
import com.riazai.repository.PracticeSessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import com.riazai.model.User;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AudioAnalysisServiceTest {

    private PracticeSessionRepository repository;
    private AudioAnalysisService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(PracticeSessionRepository.class);
        
        // Mock ChatClient using deep stubs to correctly handle the fluent API chain without needing specific nested classes
        org.springframework.ai.chat.client.ChatClient.Builder builder = Mockito.mock(org.springframework.ai.chat.client.ChatClient.Builder.class);
        org.springframework.ai.chat.client.ChatClient chatClient = Mockito.mock(org.springframework.ai.chat.client.ChatClient.class, Mockito.RETURNS_DEEP_STUBS);
        
        when(builder.build()).thenReturn(chatClient);
        when(chatClient.prompt().user(any(String.class)).call().content()).thenReturn("AI Personalized Feedback string here.");

        service = new AudioAnalysisService(repository, builder);
    }

    @Test
    void analysePracticeReturnsMetricsWithinRange() throws IOException {
        byte[] bytes = new byte[]{0, 20, -20, 45, -45, 100, -100};
        MockMultipartFile file = new MockMultipartFile("audioFile", "test.wav", "audio/wav", bytes);
        User testUser = new User("test", "pass");

        when(repository.findRecentConsistencyScoresByUser(any(User.class), any())).thenReturn(Collections.singletonList(85.0));

        PerformanceMetrics metrics = service.analysePractice(file, testUser);

        assertThat(metrics.accuracyPercentage()).isBetween(60.0, 100.0);
        assertThat(metrics.noteStability()).isBetween(55.0, 100.0);
        assertThat(metrics.consistencyScore()).isBetween(57.0, 100.0);
        assertThat(metrics.trendSeries()).hasSize(1);
        assertThat(metrics.personalisedFeedback()).isNotBlank();
    }

    @Test
    void analysePracticeRejectsEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("audioFile", "empty.wav", "audio/wav", new byte[]{});
        User testUser = new User("test", "pass");

        assertThatThrownBy(() -> service.analysePractice(file, testUser))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("empty");
    }
}
