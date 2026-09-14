package com.riazai.service;

import com.riazai.audio.f0.*;
import com.riazai.audio.wav.WavDecoder;
import com.riazai.dto.AnalysisResponse;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
public class AudioAnalysisService {

    public AnalysisResponse analyze(InputStream audioStream) throws Exception {
        long startTime = System.currentTimeMillis();

        // Use the pipeline to handle decoding, preprocessing, and YIN extraction
        F0Pipeline.AnalysisResult result = F0Pipeline.analyze(audioStream);

        long duration = System.currentTimeMillis() - startTime;

        // Extract info from pipeline result
        WavDecoder.AudioData audioData = result.audioInfo();
        List<F0Frame> frames = result.frames();
        F0DerivedMetrics.Result metrics = result.metrics();

        // Construct Response
        AnalysisResponse.AudioInfo audioInfo = new AnalysisResponse.AudioInfo(
            (double) audioData.samples().length / audioData.sampleRate(),
            audioData.sampleRate(),
            audioData.samples().length
        );

        AnalysisResponse.PitchInfo pitchInfo = new AnalysisResponse.PitchInfo();
        if (metrics.voicedFrames() > 0) {
            pitchInfo.setAvailable(true);
            pitchInfo.setMedianHz(metrics.medianHz());
            pitchInfo.setRangeHz(metrics.rangeHz());
            pitchInfo.setStability(metrics.pitchStability());
            pitchInfo.setVoicingRatio(metrics.voicingRatio());
            pitchInfo.setFrameCount(frames.size());
        } else {
            pitchInfo.setAvailable(false);
            pitchInfo.setMedianHz(0);
            pitchInfo.setRangeHz(0);
            pitchInfo.setStability(0);
            pitchInfo.setVoicingRatio(0);
            pitchInfo.setFrameCount(frames.size());
        }

        AnalysisResponse.ProcessingInfo processingInfo = new AnalysisResponse.ProcessingInfo(
            duration,
            "YIN-v2"
        );

        Map<String, String> feedback = new HashMap<>();
        if (!pitchInfo.isAvailable()) {
            feedback.put("pitch", "No voiced content detected in the audio recording.");
        }

        return new AnalysisResponse(audioInfo, pitchInfo, processingInfo, feedback);
    }
}
