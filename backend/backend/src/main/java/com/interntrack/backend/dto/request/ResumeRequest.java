package com.interntrack.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResumeRequest {
    private String title;
    private String description;
    private String fileUrl;
}