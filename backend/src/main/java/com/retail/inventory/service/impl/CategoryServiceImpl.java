package com.retail.inventory.service.impl;

import com.retail.inventory.dto.request.CategoryRequest;
import com.retail.inventory.dto.response.CategoryResponse;
import com.retail.inventory.entity.Category;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.DuplicateResourceException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.CategoryRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public Page<CategoryResponse> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public CategoryResponse findById(Long id) {
        return toResponse(findCategory(id));
    }

    @Override
    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        String name = requiredTrimmed(request.getName());
        String code = requiredTrimmed(request.getCode());
        ensureUnique(name, code, null);
        Category category = new Category();
        applyRequest(category, request, name, code);
        return toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = findCategory(id);
        String name = requiredTrimmed(request.getName());
        String code = requiredTrimmed(request.getCode());
        ensureUnique(name, code, id);
        applyRequest(category, request, name, code);
        return toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Category category = findCategory(id);
        if (productRepository.existsByCategoryId(id)) {
            throw new BadRequestException("Category cannot be deleted while products reference it");
        }
        if (categoryRepository.existsByParentId(id)) {
            throw new BadRequestException("Category cannot be deleted while subcategories reference it");
        }
        categoryRepository.delete(category);
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    private void applyRequest(Category category, CategoryRequest request, String name, String code) {
        Category parent = resolveParent(category.getId(), request.getParentId());
        category.setName(name);
        category.setCode(code);
        category.setDescription(normalizeNullable(request.getDescription()));
        category.setParent(parent);
        category.setIsActive(Boolean.TRUE.equals(request.getIsActive()));
    }

    private Category resolveParent(Long categoryId, Long parentId) {
        if (parentId == null) return null;
        if (parentId.equals(categoryId)) {
            throw new BadRequestException("A category cannot be its own parent");
        }

        Category parent = findCategory(parentId);
        Category current = parent;
        while (current != null) {
            if (current.getId().equals(categoryId)) {
                throw new BadRequestException("A category cannot be assigned to one of its descendants");
            }
            current = current.getParent();
        }
        return parent;
    }

    private void ensureUnique(String name, String code, Long id) {
        boolean duplicateName = id == null ? categoryRepository.existsByName(name) : categoryRepository.existsByNameAndIdNot(name, id);
        if (duplicateName) {
            throw new DuplicateResourceException("Category name already exists: " + name);
        }
        boolean duplicateCode = id == null ? categoryRepository.existsByCode(code) : categoryRepository.existsByCodeAndIdNot(code, id);
        if (duplicateCode) {
            throw new DuplicateResourceException("Category code already exists: " + code);
        }
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId()).name(category.getName()).code(category.getCode())
                .description(category.getDescription())
                .parentId(category.getParent() == null ? null : category.getParent().getId())
                .parentName(category.getParent() == null ? null : category.getParent().getName())
                .productCount(Math.toIntExact(productRepository.countByCategoryId(category.getId())))
                .isActive(category.getIsActive()).createdAt(category.getCreatedAt()).updatedAt(category.getUpdatedAt()).build();
    }

    private String requiredTrimmed(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
