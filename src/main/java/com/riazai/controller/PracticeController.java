package com.riazai.controller;

import com.riazai.model.PerformanceMetrics;
import com.riazai.service.AudioAnalysisService;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
public class PracticeController {

    private final AudioAnalysisService analysisService;

    public PracticeController(AudioAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "RiyazAI - Intelligent Practice Analytics");
        return "index";
    }

    @PostMapping("/analyse")
    public String analyse(@RequestParam("audioFile") @NotNull MultipartFile audioFile, Model model) {
        model.addAttribute("title", "RiyazAI - Intelligent Practice Analytics");

        if (audioFile == null || audioFile.isEmpty()) {
            model.addAttribute("error", "Please upload a recording file before analysing.");
            return "index";
        }

        try {
            PerformanceMetrics metrics = analysisService.analysePractice(audioFile);
            model.addAttribute("metrics", metrics);
            model.addAttribute("fileName", audioFile.getOriginalFilename());
        } catch (IllegalArgumentException | IOException exception) {
            model.addAttribute("error", "Unable to process this file: " + exception.getMessage());
        }

        return "index";
    }
}
