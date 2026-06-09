package com.interntrack.backend.controller;

import com.interntrack.backend.dto.request.ResumeRequest;
import com.interntrack.backend.dto.response.ResumeResponse;
import com.interntrack.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResumeResponse addResume(
            @RequestBody ResumeRequest request,
            Authentication authentication
    ) {
        return resumeService.addResume(request, authentication);
    }

    @GetMapping
    public List<ResumeResponse> getMyResumes(Authentication authentication) {
        return resumeService.getMyResumes(authentication);
    }

    @PutMapping("/{id}")
    public ResumeResponse updateResume(
            @PathVariable String id,
            @RequestBody ResumeRequest request,
            Authentication authentication
    ) {
        return resumeService.updateResume(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    public String deleteResume(
            @PathVariable String id,
            Authentication authentication
    ) {
        return resumeService.deleteResume(id, authentication);
    }
}