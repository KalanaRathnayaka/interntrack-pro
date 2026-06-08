package com.interntrack.backend.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationRequest {

    private String companyName;
    private String position;
    private String status;
    private LocalDate applicationDate;
    private LocalDate interviewDate;
    private String notes;
}