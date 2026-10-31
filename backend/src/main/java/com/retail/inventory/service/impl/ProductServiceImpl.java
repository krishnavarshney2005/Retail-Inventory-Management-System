package com.retail.inventory.service.impl;

import com.retail.inventory.dto.request.ProductRequest;
import com.retail.inventory.dto.response.ProductResponse;
import com.retail.inventory.entity.Category;
import com.retail.inventory.entity.Product;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.DuplicateResourceException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.CategoryRepository;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderItemRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.StockAlertRepository;
import com.retail.inventory.repository.StockTransactionRepository;
import com.retail.inventory.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderItemRepository orderItemRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final StockAlertRepository stockAlertRepository;

    @Override
    public Page<ProductResponse> findAll(String query, Long categoryId, Pageable pageable) {
        String normalizedQuery = normalizeNullable(query);
        return productRepository.searchProducts(normalizedQuery, categoryId, pageable).map(this::toResponse);
    }

    @Override
    public ProductResponse findById(Long id) {
        return toResponse(findProduct(id));
    }

    @Override
    @Transactional
    public ProductResponse create(ProductRequest request) {
        validateStockLevels(request);
        String sku = requiredTrimmed(request.getSku());
        String barcode = normalizeNullable(request.getBarcode());
        ensureUnique(sku, barcode, null);

        Product product = new Product();
        applyRequest(product, request, sku, barcode);
        return toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        validateStockLevels(request);
        Product product = findProduct(id);
        String sku = requiredTrimmed(request.getSku());
        String barcode = normalizeNullable(request.getBarcode());
        ensureUnique(sku, barcode, id);

        applyRequest(product, request, sku, barcode);
        return toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product product = findProduct(id);
        if (inventoryRepository.existsByProductId(id)
                || orderItemRepository.existsByProductId(id)
                || stockTransactionRepository.existsByProductId(id)
                || stockAlertRepository.existsByProductId(id)) {
            throw new BadRequestException("Product cannot be deleted while inventory, orders, transactions, or alerts reference it");
        }
        productRepository.delete(product);
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    private void applyRequest(Product product, ProductRequest request, String sku, String barcode) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        product.setSku(sku);
        product.setBarcode(barcode);
        product.setName(requiredTrimmed(request.getName()));
        product.setDescription(normalizeNullable(request.getDescription()));
        product.setCategory(category);
        product.setCostPrice(request.getCostPrice());
        product.setUnitPrice(request.getUnitPrice());
        product.setMinStockLevel(request.getMinStockLevel());
        product.setMaxStockLevel(request.getMaxStockLevel());
        product.setReorderPoint(request.getReorderPoint());
        product.setUnitOfMeasure(requiredTrimmed(request.getUnitOfMeasure()));
        product.setImageUrl(normalizeNullable(request.getImageUrl()));
        product.setIsActive(Boolean.TRUE.equals(request.getIsActive()));
    }

    private void ensureUnique(String sku, String barcode, Long id) {
        boolean duplicateSku = id == null ? productRepository.existsBySku(sku) : productRepository.existsBySkuAndIdNot(sku, id);
        if (duplicateSku) {
            throw new DuplicateResourceException("Product SKU already exists: " + sku);
        }
        if (barcode != null) {
            boolean duplicateBarcode = id == null ? productRepository.existsByBarcode(barcode) : productRepository.existsByBarcodeAndIdNot(barcode, id);
            if (duplicateBarcode) {
                throw new DuplicateResourceException("Product barcode already exists: " + barcode);
            }
        }
    }

    private void validateStockLevels(ProductRequest request) {
        if (request.getMinStockLevel() > request.getMaxStockLevel()) {
            throw new BadRequestException("Minimum stock level cannot exceed maximum stock level");
        }
        if (request.getReorderPoint() > request.getMaxStockLevel()) {
            throw new BadRequestException("Reorder point cannot exceed maximum stock level");
        }
    }

    private ProductResponse toResponse(Product product) {
        Integer totalStock = inventoryRepository.getTotalAvailableQuantityByProductId(product.getId());
        return ProductResponse.builder()
                .id(product.getId()).sku(product.getSku()).barcode(product.getBarcode()).name(product.getName())
                .description(product.getDescription()).categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName()).categoryCode(product.getCategory().getCode())
                .costPrice(product.getCostPrice()).unitPrice(product.getUnitPrice())
                .minStockLevel(product.getMinStockLevel()).maxStockLevel(product.getMaxStockLevel())
                .reorderPoint(product.getReorderPoint()).unitOfMeasure(product.getUnitOfMeasure())
                .imageUrl(product.getImageUrl()).totalStock(totalStock == null ? 0 : totalStock)
                .isActive(product.getIsActive()).createdAt(product.getCreatedAt()).updatedAt(product.getUpdatedAt()).build();
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
