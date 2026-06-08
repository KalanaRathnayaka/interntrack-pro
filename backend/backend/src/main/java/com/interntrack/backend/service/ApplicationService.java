package com.interntrack.backend.service;

import com.interntrack.backend.dto.request.ApplicationRequest;
import com.interntrack.backend.dto.response.ApplicationResponse;
import com.interntrack.backend.model.Application;
import com.interntrack.backend.model.User;
import com.interntrack.backend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.interntrack.backend.dto.response.DashboardStatsResponse;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationResponse addApplication(ApplicationRequest request, Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        Application application = Application.builder()
                .companyName(request.getCompanyName())
                .position(request.getPosition())
                .status(request.getStatus())
                .applicationDate(request.getApplicationDate())
                .interviewDate(request.getInterviewDate())
                .notes(request.getNotes())
                .userId(user.getId())
                .build();

        Application savedApplication = applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    public List<ApplicationResponse> getMyApplications(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return applicationRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ApplicationResponse mapToResponse(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getCompanyName(),
                application.getPosition(),
                application.getStatus(),
                application.getApplicationDate(),
                application.getInterviewDate(),
                application.getNotes()
        );
    }
    public ApplicationResponse updateApplication(
            String id,
            ApplicationRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this application");
        }

        application.setCompanyName(request.getCompanyName());
        application.setPosition(request.getPosition());
        application.setStatus(request.getStatus());
        application.setApplicationDate(request.getApplicationDate());
        application.setInterviewDate(request.getInterviewDate());
        application.setNotes(request.getNotes());

        Application updatedApplication = applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }
    public String deleteApplication(
            String id,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this application");
        }

        applicationRepository.delete(application);

        return "Application deleted successfully";
    }
    public DashboardStatsResponse getDashboardStats(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        List<Application> applications = applicationRepository.findByUserId(user.getId());

        long total = applications.size();
        long pending = applications.stream().filter(app -> "Pending".equalsIgnoreCase(app.getStatus())).count();
        long interview = applications.stream()
                .filter(app ->
                        "Interview".equalsIgnoreCase(app.getStatus()) ||
                                "Interview Scheduled".equalsIgnoreCase(app.getStatus()))
                .count();
        long accepted = applications.stream().filter(app -> "Accepted".equalsIgnoreCase(app.getStatus())).count();
        long rejected = applications.stream().filter(app -> "Rejected".equalsIgnoreCase(app.getStatus())).count();

        return new DashboardStatsResponse(total, pending, interview, accepted, rejected);
    }
}