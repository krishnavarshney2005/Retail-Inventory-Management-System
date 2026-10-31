package com.retail.inventory.service;
import com.retail.inventory.dto.request.StockAdjustmentRequest;
import com.retail.inventory.dto.request.StockTransferRequest;
import com.retail.inventory.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface InventoryService {
 Page<InventoryResponse> findAll(String query, Long productId, Long warehouseId, Pageable pageable); InventoryResponse findById(Long id);
 StockTransactionResponse adjust(StockAdjustmentRequest request); StockTransferResponse transfer(StockTransferRequest request);
 Page<StockTransferResponse> transfers(Pageable pageable); StockTransferResponse transferById(Long id);
 Page<StockTransactionResponse> transactions(Pageable pageable); StockTransactionResponse transactionById(Long id);
 java.util.List<InventoryResponse> lowStock(); java.util.List<StockAlertResponse> activeAlerts();
}
