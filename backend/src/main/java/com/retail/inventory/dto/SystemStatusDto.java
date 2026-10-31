package com.retail.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemStatusDto {

    private String systemName;
    private String version;
    private String status;
    private String environment;
    private String javaVersion;
    private LocalDateTime serverTime;
    private boolean databaseConnected;
    private List<String> availableModules;
    private Map<String, Object> statistics;
}
