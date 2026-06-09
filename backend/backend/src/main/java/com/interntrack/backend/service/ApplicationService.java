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
import com.interntrack.backend.repository.ResumeRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ResumeRepository resumeRepository;

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
                .resumeId(request.getResumeId())
                .resumeTitle(request.getResumeTitle())
                .interviewMode(request.getInterviewMode())
                .interviewRound(request.getInterviewRound())
                .interviewResult(request.getInterviewResult())
                .interviewNotes(request.getInterviewNotes())

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
                application.getNotes(),
                application.getResumeId(),
                application.getResumeTitle(),
                application.getInterviewMode(),
                application.getInterviewRound(),
                application.getInterviewResult(),
                application.getInterviewNotes()

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
        application.setInterviewMode(request.getInterviewMode());
        application.setInterviewRound(request.getInterviewRound());
        application.setInterviewResult(request.getInterviewResult());
        application.setInterviewNotes(request.getInterviewNotes());

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

        List<Application> applications =
                applicationRepository.findByUserId(user.getId());

        long total = applications.size();

        long pending = applications.stream()
                .filter(app -> "Pending".equalsIgnoreCase(app.getStatus()))
                .count();

        long interview = applications.stream()
                .filter(app ->
                        "Interview".equalsIgnoreCase(app.getStatus()) ||
                                "Interview Scheduled".equalsIgnoreCase(app.getStatus()))
                .count();

        long accepted = applications.stream()
                .filter(app -> "Accepted".equalsIgnoreCase(app.getStatus()))
                .count();

        long rejected = applications.stream()
                .filter(app -> "Rejected".equalsIgnoreCase(app.getStatus()))
                .count();

        long upcomingInterviews = applications.stream()
                .filter(app -> app.getInterviewDate() != null)
                .filter(app -> !app.getInterviewDate().isBefore(LocalDate.now()))
                .count();

        double successRate = total == 0
                ? 0
                : Math.round(((double) accepted / total) * 100);

        String mostAppliedCompany = applications.stream()
                .filter(app -> app.getCompanyName() != null)
                .collect(Collectors.groupingBy(
                        Application::getCompanyName,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .max(Comparator.comparingLong(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse("-");

        long resumeVersions =
                resumeRepository.findByUserId(user.getId()).size();

        return new DashboardStatsResponse(
                total,
                pending,
                interview,
                accepted,
                rejected,
                upcomingInterviews,
                successRate,
                mostAppliedCompany,
                resumeVersions
        );
    }
}