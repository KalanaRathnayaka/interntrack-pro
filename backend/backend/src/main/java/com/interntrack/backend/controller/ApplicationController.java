package com.interntrack.backend.controller;

import com.interntrack.backend.dto.request.ApplicationRequest;
import com.interntrack.backend.dto.response.ApplicationResponse;
import com.interntrack.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.interntrack.backend.dto.response.DashboardStatsResponse;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ApplicationResponse addApplication(
            @RequestBody ApplicationRequest request,
            Authentication authentication
    ) {
        return applicationService.addApplication(request, authentication);
    }

    @GetMapping
    public List<ApplicationResponse> getMyApplications(Authentication authentication) {
        return applicationService.getMyApplications(authentication);
    }
    @PutMapping("/{id}")
    public ApplicationResponse updateApplication(
            @PathVariable String id,
            @RequestBody ApplicationRequest request,
            Authentication authentication
    ) {
        return applicationService.updateApplication(id, request, authentication);
    }
    @DeleteMapping("/{id}")
    public String deleteApplication(
            @PathVariable String id,
            Authentication authentication
    ) {
        return applicationService.deleteApplication(id, authentication);
    }
    @GetMapping("/stats")
    public DashboardStatsResponse getDashboardStats(Authentication authentication) {
        return applicationService.getDashboardStats(authentication);
    }
}