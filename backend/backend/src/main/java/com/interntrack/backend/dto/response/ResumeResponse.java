package com.interntrack.backend.dto.response;

public record ResumeResponse(
        String id,
        String title,
        String description,
        String fileUrl
) {
}