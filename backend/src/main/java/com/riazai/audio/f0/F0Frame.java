package com.riazai.audio.f0;

/**
 * Represents a single frame of pitch analysis.
 */
public record F0Frame(
    double timestampMs,
    double frequencyHz,
    double confidence,
    boolean voiced
) {}
