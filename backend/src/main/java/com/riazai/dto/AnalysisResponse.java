package com.riazai.dto;

import java.util.Map;

public class AnalysisResponse {
    private String analysisVersion = "2.0.0-YIN";
    private AudioInfo audio;
    private PitchInfo pitch;
    private ProcessingInfo processing;
    private Map<String, String> feedback;

    public AnalysisResponse() {}

    public AnalysisResponse(AudioInfo audio, PitchInfo pitch, ProcessingInfo processing, Map<String, String> feedback) {
        this.audio = audio;
        this.pitch = pitch;
        this.processing = processing;
        this.feedback = feedback;
    }

    public String getAnalysisVersion() { return analysisVersion; }
    public void setAnalysisVersion(String analysisVersion) { this.analysisVersion = analysisVersion; }

    public AudioInfo getAudio() { return audio; }
    public void setAudio(AudioInfo audio) { this.audio = audio; }

    public PitchInfo getPitch() { return pitch; }
    public void setPitch(PitchInfo pitch) { this.pitch = pitch; }

    public ProcessingInfo getProcessing() { return processing; }
    public void setProcessing(ProcessingInfo processing) { this.processing = processing; }

    public Map<String, String> getFeedback() { return feedback; }
    public void setFeedback(Map<String, String> feedback) { this.feedback = feedback; }

    public static class AudioInfo {
        private double durationSeconds;
        private float sampleRate;
        private int sampleCount;

        public AudioInfo(double durationSeconds, float sampleRate, int sampleCount) {
            this.durationSeconds = durationSeconds;
            this.sampleRate = sampleRate;
            this.sampleCount = sampleCount;
        }

        public double getDurationSeconds() { return durationSeconds; }
        public float getSampleRate() { return sampleRate; }
        public int getSampleCount() { return sampleCount; }
    }

    public static class PitchInfo {
        private boolean available;
        private double medianHz;
        private double rangeHz;
        private double stability;
        private double voicingRatio;
        private int frameCount;

        public PitchInfo() {}

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }

        public double getMedianHz() { return medianHz; }
        public void setMedianHz(double medianHz) { this.medianHz = medianHz; }

        public double getRangeHz() { return rangeHz; }
        public void setRangeHz(double rangeHz) { this.rangeHz = rangeHz; }

        public double getStability() { return stability; }
        public void setStability(double stability) { this.stability = stability; }

        public double getVoicingRatio() { return voicingRatio; }
        public void setVoicingRatio(double voicingRatio) { this.voicingRatio = voicingRatio; }

        public int getFrameCount() { return frameCount; }
        public void setFrameCount(int frameCount) { this.frameCount = frameCount; }
    }

    public static class ProcessingInfo {
        private long processingTimeMs;
        private String pipeline;

        public ProcessingInfo(long processingTimeMs, String pipeline) {
            this.processingTimeMs = processingTimeMs;
            this.pipeline = pipeline;
        }

        public long getProcessingTimeMs() { return processingTimeMs; }
        public String getPipeline() { return pipeline; }
    }
}
