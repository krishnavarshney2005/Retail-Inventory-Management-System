package com.retail.inventory.service;

import com.retail.inventory.dto.request.CategoryRequest;
import com.retail.inventory.entity.Category;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.repository.CategoryRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceImplTest {

    @Mock private CategoryRepository categoryRepository;
    @Mock private ProductRepository productRepository;
    @InjectMocks private CategoryServiceImpl categoryService;

    @Test
    void updateRejectsSelfAsParent() {
        Category category = new Category();
        category.setId(4L);
        when(categoryRepository.findById(4L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsByNameAndIdNot("Accessories", 4L)).thenReturn(false);
        when(categoryRepository.existsByCodeAndIdNot("ACC", 4L)).thenReturn(false);

        CategoryRequest request = CategoryRequest.builder().name("Accessories").code("ACC").parentId(4L).isActive(true).build();

        assertThrows(BadRequestException.class, () -> categoryService.update(4L, request));
        verify(categoryRepository, never()).save(category);
    }

    @Test
    void deleteRejectsCategoryWithProducts() {
        Category category = new Category();
        category.setId(4L);
        when(categoryRepository.findById(4L)).thenReturn(Optional.of(category));
        when(productRepository.existsByCategoryId(4L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> categoryService.delete(4L));
        verify(categoryRepository, never()).delete(category);
    }
}
