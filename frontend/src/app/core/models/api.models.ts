export interface ApiResponse<T> { success: boolean; message: string; data: T; timestamp: string; }
export interface Page<T> { content: T[]; totalElements: number; totalPages: number; size: number; number: number; first: boolean; last: boolean; empty: boolean; }
export interface PageRequest { page?: number; size?: number; sort?: string; }
export interface Product { id: number; sku: string; barcode?: string; name: string; description?: string; categoryId: number; categoryName: string; categoryCode?: string; costPrice: number; unitPrice: number; minStockLevel: number; maxStockLevel: number; reorderPoint: number; unitOfMeasure: string; imageUrl?: string; totalStock: number; isActive: boolean; }
export type ProductRequest = Omit<Product, 'id' | 'categoryName' | 'categoryCode' | 'totalStock'>;
export interface Category { id: number; name: string; code: string; description?: string; parentId?: number; parentName?: string; productCount: number; isActive: boolean; }
export type CategoryRequest = Omit<Category, 'id' | 'parentName' | 'productCount'>;
export interface Warehouse { id: number; warehouseCode: string; name: string; address: string; city: string; state: string; country: string; postalCode: string; capacitySqft: number; managerName?: string; phone?: string; email?: string; isActive: boolean; }
export type WarehouseRequest = Omit<Warehouse, 'id'>;
export interface Supplier { id: number; companyName: string; supplierCode: string; contactPerson?: string; email: string; phone?: string; address?: string; city?: string; state?: string; country?: string; postalCode?: string; taxId?: string; isActive: boolean; }
export type SupplierRequest = Omit<Supplier, 'id'>;
export interface Inventory { id: number; productId: number; productSku: string; productName: string; warehouseId: number; warehouseCode: string; warehouseName: string; quantityOnHand: number; quantityReserved: number; quantityAvailable: number; binLocation?: string; reorderPoint: number; isLowStock: boolean; updatedAt: string; }
export interface StockTransaction { id: number; transactionCode: string; productId: number; productName: string; warehouseId: number; warehouseName: string; transactionType: string; quantity: number; previousQuantity: number; newQuantity: number; reason?: string; createdAt: string; }
export interface StockTransfer { id: number; referenceNumber: string; productId: number; productName: string; fromWarehouseId: number; fromWarehouseName: string; toWarehouseId: number; toWarehouseName: string; quantity: number; createdAt: string; }
export interface StockAlert { id: number; productId: number; productName: string; warehouseId: number; warehouseName: string; status: string; message: string; createdAt: string; }
export interface OrderItemRequest { productId: number; quantity: number; unitPrice: number; }
export interface OrderItem { id: number; productId: number; productName: string; productSku: string; quantity: number; unitPrice: number; totalPrice: number; }
export interface Order { id: number; orderNumber: string; orderType: 'PURCHASE' | 'SALES'; status: string; warehouseId: number; warehouseCode: string; supplierId?: number; supplierName?: string; totalAmount: number; taxAmount: number; shippingAmount: number; orderDate: string; expectedDeliveryDate?: string; notes?: string; items: OrderItem[]; }
export interface OrderRequest { orderType: 'PURCHASE' | 'SALES'; supplierId?: number; warehouseId: number; taxAmount?: number; shippingAmount?: number; orderDate?: string; expectedDeliveryDate?: string; notes?: string; items: OrderItemRequest[]; }
export interface Dashboard { totalProducts: number; totalCategories: number; totalWarehouses: number; totalSuppliers: number; totalInventoryUnits: number; pendingOrders: number; lowStockProducts: number; recentOrders: unknown[]; recentTransactions: unknown[]; warehouseInventory: unknown[]; }
export interface Report { inventory: unknown[]; orders: unknown[]; movements: unknown[]; inventoryValuation: number; }
