package com.retail.inventory.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Category code is required")
    @Size(max = 50, message = "Category code cannot exceed 50 characters")
    private String code;

    private String description;

    private Long parentId;

    @Builder.Default
    private Boolean isActive = true;
}
