package com.retail.inventory.service.impl;

import com.retail.inventory.dto.request.SupplierRequest;
import com.retail.inventory.dto.response.SupplierResponse;
import com.retail.inventory.entity.Supplier;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.DuplicateResourceException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.OrderRepository;
import com.retail.inventory.repository.SupplierRepository;
import com.retail.inventory.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;
    public Page<SupplierResponse> findAll(String query, Pageable pageable) { return supplierRepository.search(normalize(query), pageable).map(this::toResponse); }
    public SupplierResponse findById(Long id) { return toResponse(find(id)); }
    @Transactional public SupplierResponse create(SupplierRequest request) { String code = required(request.getSupplierCode()); if (supplierRepository.existsBySupplierCode(code)) throw new DuplicateResourceException("Supplier code already exists: " + code); Supplier supplier = new Supplier(); apply(supplier, request, code); return toResponse(supplierRepository.save(supplier)); }
    @Transactional public SupplierResponse update(Long id, SupplierRequest request) { Supplier supplier = find(id); String code = required(request.getSupplierCode()); if (supplierRepository.existsBySupplierCodeAndIdNot(code, id)) throw new DuplicateResourceException("Supplier code already exists: " + code); apply(supplier, request, code); return toResponse(supplierRepository.save(supplier)); }
    @Transactional public void delete(Long id) { Supplier supplier = find(id); if (orderRepository.existsBySupplierId(id)) throw new BadRequestException("Supplier cannot be deleted while orders reference it"); supplierRepository.delete(supplier); }
    private Supplier find(Long id) { return supplierRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id)); }
    private void apply(Supplier s, SupplierRequest r, String code) { s.setCompanyName(required(r.getCompanyName())); s.setSupplierCode(code); s.setContactPerson(normalize(r.getContactPerson())); s.setEmail(required(r.getEmail())); s.setPhone(normalize(r.getPhone())); s.setAddress(normalize(r.getAddress())); s.setCity(normalize(r.getCity())); s.setState(normalize(r.getState())); s.setCountry(defaulted(r.getCountry(), "USA")); s.setPostalCode(normalize(r.getPostalCode())); s.setTaxId(normalize(r.getTaxId())); s.setIsActive(Boolean.TRUE.equals(r.getIsActive())); }
    private SupplierResponse toResponse(Supplier s) { return SupplierResponse.builder().id(s.getId()).companyName(s.getCompanyName()).supplierCode(s.getSupplierCode()).contactPerson(s.getContactPerson()).email(s.getEmail()).phone(s.getPhone()).address(s.getAddress()).city(s.getCity()).state(s.getState()).country(s.getCountry()).postalCode(s.getPostalCode()).taxId(s.getTaxId()).isActive(s.getIsActive()).createdAt(s.getCreatedAt()).updatedAt(s.getUpdatedAt()).build(); }
    private String required(String v) { return v == null ? null : v.trim(); }
    private String normalize(String v) { if (v == null) return null; String n = v.trim(); return n.isEmpty() ? null : n; }
    private String defaulted(String v, String fallback) { String n = normalize(v); return n == null ? fallback : n; }
}
