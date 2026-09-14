package com.riazai.audio.wav;

import javax.sound.sampled.*;
import java.io.*;
import java.nio.*;

/**
 * Minimal WAV decoder for monophonic PCM audio.
 */
public class WavDecoder {

    public record AudioData(double[] samples, float sampleRate) {}

    public static AudioData decode(InputStream inputStream) throws IOException, UnsupportedAudioFileException {
        AudioInputStream ais = AudioSystem.getAudioInputStream(inputStream);
        AudioFormat format = ais.getFormat();

        if (format.getEncoding() != AudioFormat.Encoding.PCM_SIGNED) {
            throw new UnsupportedAudioFileException("Only signed PCM WAV files are supported");
        }

        byte[] bytes = ais.readAllBytes();
        int bytesPerSample = format.getSampleSizeInBits() / 8;
        int numSamples = bytes.length / bytesPerSample;
        double[] samples = new double[numSamples];

        ByteBuffer buffer = ByteBuffer.wrap(bytes).order(
            format.isBigEndian() ? ByteOrder.BIG_ENDIAN : ByteOrder.LITTLE_ENDIAN
        );

        for (int i = 0; i < numSamples; i++) {
            if (bytesPerSample == 2) {
                samples[i] = buffer.getShort() / 32768.0;
            } else if (bytesPerSample == 1) {
                samples[i] = (buffer.get() & 0xFF) / 128.0 - 1.0;
            } else if (bytesPerSample == 4) {
                // Float PCM
                samples[i] = buffer.getFloat();
            }
        }

        // Convert stereo to mono if necessary
        if (format.getChannels() > 1) {
            int monoSamples = numSamples / format.getChannels();
            double[] mono = new double[monoSamples];
            for (int i = 0; i < monoSamples; i++) {
                double sum = 0;
                for (int c = 0; c < format.getChannels(); c++) {
                    sum += samples[i * format.getChannels() + c];
                }
                mono[i] = sum / format.getChannels();
            }
            samples = mono;
        }

        return new AudioData(samples, format.getSampleRate());
    }
}
