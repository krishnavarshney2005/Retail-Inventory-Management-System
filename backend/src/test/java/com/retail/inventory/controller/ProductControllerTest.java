package com.retail.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retail.inventory.dto.request.ProductRequest;
import com.retail.inventory.dto.response.ProductResponse;
import com.retail.inventory.exception.DuplicateResourceException;
import com.retail.inventory.exception.GlobalExceptionHandler;
import com.retail.inventory.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@Import(GlobalExceptionHandler.class)
class ProductControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private ProductService productService;
    @MockBean(name = "jpaMappingContext") private JpaMetamodelMappingContext jpaMappingContext;

    @Test
    void createReturns201ForValidRequest() throws Exception {
        ProductResponse response = ProductResponse.builder().id(42L).sku("SKU-42").name("Desk lamp").build();
        when(productService.create(any())).thenReturn(response);

        mockMvc.perform(post("/v1/products").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(42));
    }

    @Test
    void createReturns400ForInvalidRequest() throws Exception {
        mockMvc.perform(post("/v1/products").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void createReturns409ForDuplicateSku() throws Exception {
        when(productService.create(any())).thenThrow(new DuplicateResourceException("Product SKU already exists: SKU-42"));

        mockMvc.perform(post("/v1/products").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getUpdateAndDeleteUseExpectedStatusCodes() throws Exception {
        ProductResponse response = ProductResponse.builder().id(42L).sku("SKU-42").name("Desk lamp").build();
        when(productService.findById(42L)).thenReturn(response);
        when(productService.update(any(), any())).thenReturn(response);
        doNothing().when(productService).delete(42L);

        mockMvc.perform(get("/v1/products/42"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.sku").value("SKU-42"));
        mockMvc.perform(put("/v1/products/42").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isOk());
        mockMvc.perform(delete("/v1/products/42"))
                .andExpect(status().isNoContent());
    }

    private ProductRequest validRequest() {
        return ProductRequest.builder().sku("SKU-42").name("Desk lamp").categoryId(1L)
                .costPrice(new BigDecimal("12.00")).unitPrice(new BigDecimal("25.00"))
                .minStockLevel(1).maxStockLevel(30).reorderPoint(5).unitOfMeasure("UNIT").isActive(true).build();
    }
}
