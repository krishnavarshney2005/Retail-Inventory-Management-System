package com.retail.inventory.service;

import com.retail.inventory.dto.response.ReportResponse;
import java.time.LocalDate;

public interface ReportService { ReportResponse getReport(Long warehouseId, Long productId, LocalDate fromDate, LocalDate toDate); }
