package com.interntrack.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
public class Application {

    @Id
    private String id;

    private String companyName;
    private String position;
    private String status;
    private LocalDate applicationDate;
    private LocalDate interviewDate;
    private String notes;
    private String userId;
    private String resumeId;
    private String resumeTitle;
    private String interviewMode;
    private String interviewRound;
    private String interviewResult;
    private String interviewNotes;
}