-- ====================================================================
-- Retail Inventory Management System
-- Database Schema Definition (MySQL 8.0+)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS retail_inventory_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE retail_inventory_db;

-- --------------------------------------------------------------------
-- 1. Categories Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    parent_id BIGINT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) 
        REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 2. Suppliers Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    contact_person VARCHAR(100),
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(80),
    state VARCHAR(80),
    country VARCHAR(80) DEFAULT 'USA',
    postal_code VARCHAR(20),
    tax_id VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 3. Warehouses Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    country VARCHAR(80) DEFAULT 'USA',
    postal_code VARCHAR(20) NOT NULL,
    capacity_sqft INT,
    manager_name VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(120),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 4. Products Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(60) NOT NULL UNIQUE,
    barcode VARCHAR(60) UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    cost_price DECIMAL(12, 2) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    min_stock_level INT NOT NULL DEFAULT 10,
    max_stock_level INT NOT NULL DEFAULT 500,
    reorder_point INT NOT NULL DEFAULT 25,
    unit_of_measure VARCHAR(30) DEFAULT 'UNIT',
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);

-- --------------------------------------------------------------------
-- 5. Inventories Table (Product stock per warehouse)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    quantity_on_hand INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    quantity_available INT GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    bin_location VARCHAR(50),
    last_counted_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT uq_product_warehouse UNIQUE (product_id, warehouse_id),
    CONSTRAINT fk_inventories_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventories_warehouse FOREIGN KEY (warehouse_id) 
        REFERENCES warehouses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_inventories_product ON inventories(product_id);
CREATE INDEX idx_inventories_warehouse ON inventories(warehouse_id);

-- --------------------------------------------------------------------
-- 6. Inventory Transactions Audit Log
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(60) NOT NULL UNIQUE,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    transaction_type ENUM('PURCHASE_RECEIPT', 'SALES_DISPATCH', 'TRANSFER_IN', 'TRANSFER_OUT', 'STOCK_ADJUSTMENT', 'RETURN') NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(12, 2),
    reference_number VARCHAR(100),
    notes TEXT,
    performed_by VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_tx_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_warehouse FOREIGN KEY (warehouse_id) 
        REFERENCES warehouses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_tx_product ON inventory_transactions(product_id);
CREATE INDEX idx_tx_date ON inventory_transactions(created_at);

-- --------------------------------------------------------------------
-- 7. Orders Table (Purchase & Sales Orders)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(60) NOT NULL UNIQUE,
    order_type ENUM('PURCHASE_ORDER', 'SALES_ORDER') NOT NULL,
    supplier_id BIGINT NULL,
    warehouse_id BIGINT NOT NULL,
    customer_name VARCHAR(150) NULL,
    customer_email VARCHAR(120) NULL,
    status ENUM('DRAFT', 'PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    shipping_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_orders_supplier FOREIGN KEY (supplier_id) 
        REFERENCES suppliers(id) ON DELETE SET NULL,
    CONSTRAINT fk_orders_warehouse FOREIGN KEY (warehouse_id) 
        REFERENCES warehouses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);

-- --------------------------------------------------------------------
-- 8. Order Items Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity_ordered INT NOT NULL,
    quantity_received INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- --------------------------------------------------------------------
-- 9. Low Stock & Critical Alerts Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    alert_type ENUM('LOW_STOCK', 'OUT_OF_STOCK', 'REORDER_POINT_REACHED', 'OVERSTOCK') NOT NULL,
    current_quantity INT NOT NULL,
    threshold_quantity INT NOT NULL,
    status ENUM('ACTIVE', 'RESOLVED', 'ACKNOWLEDGED') NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_alerts_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_alerts_warehouse FOREIGN KEY (warehouse_id) 
        REFERENCES warehouses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_alerts_status ON stock_alerts(status);
