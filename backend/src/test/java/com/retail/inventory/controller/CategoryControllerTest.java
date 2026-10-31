package com.retail.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retail.inventory.dto.request.CategoryRequest;
import com.retail.inventory.dto.response.CategoryResponse;
import com.retail.inventory.exception.GlobalExceptionHandler;
import com.retail.inventory.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@Import(GlobalExceptionHandler.class)
class CategoryControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private CategoryService categoryService;
    @MockBean(name = "jpaMappingContext") private JpaMetamodelMappingContext jpaMappingContext;

    @Test
    void createReturns201ForValidRequest() throws Exception {
        when(categoryService.create(any())).thenReturn(CategoryResponse.builder().id(9L).name("Lighting").code("LIGHT").build());

        mockMvc.perform(post("/v1/categories").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(CategoryRequest.builder().name("Lighting").code("LIGHT").isActive(true).build())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(9));
    }

    @Test
    void createReturns400ForInvalidRequest() throws Exception {
        mockMvc.perform(post("/v1/categories").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getUpdateAndDeleteUseExpectedStatusCodes() throws Exception {
        CategoryResponse response = CategoryResponse.builder().id(9L).name("Lighting").code("LIGHT").build();
        CategoryRequest request = CategoryRequest.builder().name("Lighting").code("LIGHT").isActive(true).build();
        when(categoryService.findById(9L)).thenReturn(response);
        when(categoryService.update(any(), any())).thenReturn(response);
        doNothing().when(categoryService).delete(9L);

        mockMvc.perform(get("/v1/categories/9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.code").value("LIGHT"));
        mockMvc.perform(put("/v1/categories/9").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
        mockMvc.perform(delete("/v1/categories/9"))
                .andExpect(status().isNoContent());
    }
}
