package com.interntrack.backend.controller;

import com.interntrack.backend.dto.request.CompanyRequest;
import com.interntrack.backend.dto.response.CompanyResponse;
import com.interntrack.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public CompanyResponse addCompany(
            @RequestBody CompanyRequest request,
            Authentication authentication
    ) {
        return companyService.addCompany(request, authentication);
    }

    @GetMapping
    public List<CompanyResponse> getMyCompanies(
            Authentication authentication
    ) {
        return companyService.getMyCompanies(authentication);
    }

    @PutMapping("/{id}")
    public CompanyResponse updateCompany(
            @PathVariable String id,
            @RequestBody CompanyRequest request,
            Authentication authentication
    ) {
        return companyService.updateCompany(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    public String deleteCompany(
            @PathVariable String id,
            Authentication authentication
    ) {
        return companyService.deleteCompany(id, authentication);
    }
}