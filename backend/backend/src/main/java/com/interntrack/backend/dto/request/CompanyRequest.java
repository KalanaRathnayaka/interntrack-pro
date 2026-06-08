package com.interntrack.backend.dto.request;

import lombok.Data;

@Data
public class CompanyRequest {

    private String name;
    private String website;
    private String location;
}