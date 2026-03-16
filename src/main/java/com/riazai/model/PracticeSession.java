package com.riazai.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class PracticeSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private double accuracyPercentage;
    private double noteStability;
    private double consistencyScore;
    private LocalDateTime timestamp;

    public PracticeSession() {}

    public PracticeSession(String fileName, double accuracyPercentage, double noteStability, double consistencyScore) {
        this.fileName = fileName;
        this.accuracyPercentage = accuracyPercentage;
        this.noteStability = noteStability;
        this.consistencyScore = consistencyScore;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public double getAccuracyPercentage() { return accuracyPercentage; }
    public void setAccuracyPercentage(double accuracyPercentage) { this.accuracyPercentage = accuracyPercentage; }

    public double getNoteStability() { return noteStability; }
    public void setNoteStability(double noteStability) { this.noteStability = noteStability; }

    public double getConsistencyScore() { return consistencyScore; }
    public void setConsistencyScore(double consistencyScore) { this.consistencyScore = consistencyScore; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
