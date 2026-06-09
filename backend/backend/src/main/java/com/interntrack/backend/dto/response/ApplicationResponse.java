package com.interntrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ApplicationResponse {

    private String id;
    private String companyName;
    private String position;
    private String status;
    private LocalDate applicationDate;
    private LocalDate interviewDate;
    private String notes;
    private String resumeId;
    private String resumeTitle;
    private String interviewMode;
    private String interviewRound;
    private String interviewResult;
    private String interviewNotes;
}