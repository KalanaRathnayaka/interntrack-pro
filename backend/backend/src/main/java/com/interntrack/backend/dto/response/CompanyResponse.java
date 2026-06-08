package com.interntrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyResponse {

    private String id;
    private String name;
    private String website;
    private String location;
}