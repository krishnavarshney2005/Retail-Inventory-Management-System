package com.retail.inventory.service;

import com.retail.inventory.dto.request.ProductRequest;
import com.retail.inventory.entity.Category;
import com.retail.inventory.entity.Product;
import com.retail.inventory.exception.DuplicateResourceException;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.repository.CategoryRepository;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderItemRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.StockAlertRepository;
import com.retail.inventory.repository.StockTransactionRepository;
import com.retail.inventory.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private StockTransactionRepository stockTransactionRepository;
    @Mock private StockAlertRepository stockAlertRepository;
    @InjectMocks private ProductServiceImpl productService;

    @Test
    void createPersistsProductWhenRequestIsValid() {
        Category category = category(7L);
        when(productRepository.existsBySku("SKU-100")).thenReturn(false);
        when(productRepository.existsByBarcode("123456")).thenReturn(false);
        when(categoryRepository.findById(7L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(12L);
            return product;
        });
        when(inventoryRepository.getTotalAvailableQuantityByProductId(12L)).thenReturn(0);

        var response = productService.create(productRequest());

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        assertEquals("SKU-100", captor.getValue().getSku());
        assertEquals(12L, response.getId());
        assertEquals("Catalog", response.getCategoryName());
    }

    @Test
    void createRejectsDuplicateSku() {
        when(productRepository.existsBySku("SKU-100")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> productService.create(productRequest()));

        verify(productRepository, never()).save(any());
    }

    @Test
    void deleteRejectsReferencedProduct() {
        Product product = new Product();
        product.setId(12L);
        when(productRepository.findById(12L)).thenReturn(Optional.of(product));
        when(inventoryRepository.existsByProductId(12L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> productService.delete(12L));

        verify(productRepository, never()).delete(any());
    }

    private ProductRequest productRequest() {
        return ProductRequest.builder().sku("SKU-100").barcode("123456").name("Sample product")
                .categoryId(7L).costPrice(new BigDecimal("10.00")).unitPrice(new BigDecimal("15.00"))
                .minStockLevel(2).maxStockLevel(50).reorderPoint(10).unitOfMeasure("UNIT").isActive(true).build();
    }

    private Category category(Long id) {
        Category category = new Category();
        category.setId(id);
        category.setName("Catalog");
        category.setCode("CAT");
        return category;
    }
}
