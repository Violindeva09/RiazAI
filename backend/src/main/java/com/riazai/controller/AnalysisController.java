package com.riazai.controller;

import com.riazai.dto.AnalysisResponse;
import com.riazai.service.AudioAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class AnalysisController {

    private final AudioAnalysisService analysisService;

    @Autowired
    public AnalysisController(AudioAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/analyse")
    public ResponseEntity<?> analyse(@RequestParam("audioFile") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Audio file is missing or empty.");
        }

        if (!"audio/wav".equalsIgnoreCase(file.getContentType()) && !file.getOriginalFilename().endsWith(".wav")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body("Only WAV files are supported.");
        }

        try {
            AnalysisResponse response = analysisService.analyze(file.getInputStream());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Malformed WAV file: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during analysis: " + e.getMessage());
        }
    }
}
