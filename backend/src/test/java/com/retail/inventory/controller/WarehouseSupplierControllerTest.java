package com.retail.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retail.inventory.dto.request.SupplierRequest;
import com.retail.inventory.dto.request.WarehouseRequest;
import com.retail.inventory.dto.response.SupplierResponse;
import com.retail.inventory.dto.response.WarehouseResponse;
import com.retail.inventory.exception.GlobalExceptionHandler;
import com.retail.inventory.service.SupplierService;
import com.retail.inventory.service.WarehouseService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({WarehouseController.class, SupplierController.class})
@Import(GlobalExceptionHandler.class)
class WarehouseSupplierControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private WarehouseService warehouseService;
    @MockBean private SupplierService supplierService;
    @MockBean(name = "jpaMappingContext") private JpaMetamodelMappingContext jpaMappingContext;

    @Test
    void createsWarehouseAndSupplier() throws Exception {
        when(warehouseService.create(any())).thenReturn(WarehouseResponse.builder().id(1L).warehouseCode("WH-1").build());
        when(supplierService.create(any())).thenReturn(SupplierResponse.builder().id(2L).supplierCode("SUP-1").build());
        WarehouseRequest warehouse = WarehouseRequest.builder().warehouseCode("WH-1").name("Central").address("Road").city("Pune").state("MH").postalCode("411001").email("warehouse@example.com").isActive(true).build();
        SupplierRequest supplier = SupplierRequest.builder().companyName("Supply Co").supplierCode("SUP-1").email("orders@supply.example").phone("+91 98765 43210").isActive(true).build();
        mockMvc.perform(post("/v1/warehouses").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(warehouse))).andExpect(status().isCreated()).andExpect(jsonPath("$.data.id").value(1));
        mockMvc.perform(post("/v1/suppliers").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(supplier))).andExpect(status().isCreated()).andExpect(jsonPath("$.data.id").value(2));
    }

    @Test
    void rejectsInvalidContactData() throws Exception {
        WarehouseRequest warehouse = WarehouseRequest.builder().warehouseCode("WH-1").name("Central").address("Road").city("Pune").state("MH").postalCode("411001").email("not-an-email").isActive(true).build();
        SupplierRequest supplier = SupplierRequest.builder().companyName("Supply Co").supplierCode("SUP-1").email("invalid").phone("abc").isActive(true).build();
        mockMvc.perform(post("/v1/warehouses").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(warehouse))).andExpect(status().isBadRequest());
        mockMvc.perform(post("/v1/suppliers").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(supplier))).andExpect(status().isBadRequest());
    }
}
