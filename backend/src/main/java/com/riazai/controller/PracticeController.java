package com.riazai.controller;

import com.riazai.model.PerformanceMetrics;
import com.riazai.model.User;
import com.riazai.repository.UserRepository;
import com.riazai.service.AudioAnalysisService;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PracticeController {

    private final AudioAnalysisService analysisService;
    private final UserRepository userRepository;

    public PracticeController(AudioAnalysisService analysisService, UserRepository userRepository) {
        this.analysisService = analysisService;
        this.userRepository = userRepository;
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of("username", principal.getName()));
    }

    @PostMapping("/analyse")
    public ResponseEntity<?> analyse(@RequestParam("audioFile") @NotNull MultipartFile audioFile, java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        if (audioFile == null || audioFile.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please upload a recording file before analysing."));
        }

        try {
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            PerformanceMetrics metrics = analysisService.analysePractice(audioFile, user);
            return ResponseEntity.ok(metrics);
        } catch (IllegalArgumentException | IOException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", "Unable to process this file: " + exception.getMessage()));
        }
    }
}
