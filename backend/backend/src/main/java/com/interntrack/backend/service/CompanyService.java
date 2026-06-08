package com.interntrack.backend.service;

import com.interntrack.backend.dto.request.CompanyRequest;
import com.interntrack.backend.dto.response.CompanyResponse;
import com.interntrack.backend.model.Company;
import com.interntrack.backend.model.User;
import com.interntrack.backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyResponse addCompany(CompanyRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Company company = Company.builder()
                .name(request.getName())
                .website(request.getWebsite())
                .location(request.getLocation())
                .userId(user.getId())
                .build();

        return mapToResponse(companyRepository.save(company));
    }

    public List<CompanyResponse> getMyCompanies(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return companyRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CompanyResponse updateCompany(String id, CompanyRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!company.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to update this company");
        }

        company.setName(request.getName());
        company.setWebsite(request.getWebsite());
        company.setLocation(request.getLocation());

        return mapToResponse(companyRepository.save(company));
    }

    public String deleteCompany(String id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!company.getUserId().equals(user.getId())) {
            throw new RuntimeException("You are not allowed to delete this company");
        }

        companyRepository.delete(company);
        return "Company deleted successfully";
    }

    private CompanyResponse mapToResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getWebsite(),
                company.getLocation()
        );
    }
}