package com.interntrack.backend.service;

import com.interntrack.backend.dto.request.ResumeRequest;
import com.interntrack.backend.dto.response.ResumeResponse;
import com.interntrack.backend.model.Resume;
import com.interntrack.backend.model.User;
import com.interntrack.backend.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeResponse addResume(ResumeRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Resume resume = Resume.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .userId(user.getId())
                .build();

        return mapToResponse(resumeRepository.save(resume));
    }

    public List<ResumeResponse> getMyResumes(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return resumeRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ResumeResponse updateResume(
            String id,
            ResumeRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this resume");
        }

        resume.setTitle(request.getTitle());
        resume.setDescription(request.getDescription());
        resume.setFileUrl(request.getFileUrl());

        return mapToResponse(resumeRepository.save(resume));
    }

    public String deleteResume(String id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this resume");
        }

        resumeRepository.delete(resume);

        return "Resume deleted successfully";
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getTitle(),
                resume.getDescription(),
                resume.getFileUrl()
        );
    }
}