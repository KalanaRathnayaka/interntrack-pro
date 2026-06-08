package com.interntrack.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {

    private long total;
    private long pending;
    private long interview;
    private long accepted;
    private long rejected;
}