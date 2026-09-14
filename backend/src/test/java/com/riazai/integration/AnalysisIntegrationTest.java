package com.riazai.integration;

import com.riazai.dto.AnalysisResponse;
import com.riazai.service.AudioAnalysisService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AnalysisIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AudioAnalysisService analysisService;

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    public void testAnalyzePureTone440Hz() throws Exception {
        byte[] wavData = generateSineWaveWav(440.0, 44100, 1000);
        
        mockMvc.perform(multipart("/api/analyse")
                .file(new MockMultipartFile("audioFile", "test440.wav", "audio/wav", wavData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pitch.available").value(true))
                .andExpect(jsonPath("$.pitch.medianHz").exists());
    }

    @Test
    public void testAnalyzeSilence() throws Exception {
        byte[] wavData = generateSineWaveWav(0, 44100, 500);
        
        mockMvc.perform(multipart("/api/analyse")
                .file(new MockMultipartFile("audioFile", "silence.wav", "audio/wav", wavData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pitch.available").value(false));
    }

    @Test
    public void testEmptyFile() throws Exception {
        mockMvc.perform(multipart("/api/analyse")
                .file(new MockMultipartFile("audioFile", "empty.wav", "audio/wav", new byte[0])))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testUnsupportedFormat() throws Exception {
        mockMvc.perform(multipart("/api/analyse")
                .file(new MockMultipartFile("audioFile", "test.txt", "text/plain", "hello".getBytes())))
                .andExpect(status().isUnsupportedMediaType());
    }

    private byte[] generateSineWaveWav(double freq, int sampleRate, int durationMs) {
        int numSamples = (int) (sampleRate * durationMs / 1000.0);
        int bytesPerSample = 2;
        int dataSize = numSamples * bytesPerSample;
        
        ByteBuffer buffer = ByteBuffer.allocate(44 + dataSize).order(ByteOrder.LITTLE_ENDIAN);
        
        // RIFF header
        buffer.put("RIFF".getBytes());
        buffer.putInt(36 + dataSize);
        buffer.put("WAVE".getBytes());
        
        // fmt chunk
        buffer.put("fmt ".getBytes());
        buffer.putInt(16); // size
        buffer.putShort((short) 1); // PCM
        buffer.putShort((short) 1); // Mono
        buffer.putInt(sampleRate);
        buffer.putInt(sampleRate * bytesPerSample); // byte rate
        buffer.putShort((short) bytesPerSample);
        buffer.putShort((short) 16);
        
        // data chunk
        buffer.put("data".getBytes());
        buffer.putInt(dataSize);
        
        for (int i = 0; i < numSamples; i++) {
            double sample = Math.sin(2 * Math.PI * freq * i / sampleRate);
            buffer.putShort((short) (sample * 32767));
        }
        
        return buffer.array();
    }
}
