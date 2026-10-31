ALTER TABLE inventory_transactions
    ADD COLUMN previous_quantity INT NOT NULL DEFAULT 0 AFTER quantity,
    ADD COLUMN new_quantity INT NOT NULL DEFAULT 0 AFTER previous_quantity;

CREATE TABLE stock_transfers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL, from_warehouse_id BIGINT NOT NULL, to_warehouse_id BIGINT NOT NULL,
    quantity INT NOT NULL, notes TEXT, performed_by VARCHAR(100), reference_number VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CONSTRAINT fk_transfer_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    CONSTRAINT fk_transfer_from_warehouse FOREIGN KEY (from_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT,
    CONSTRAINT fk_transfer_to_warehouse FOREIGN KEY (to_warehouse_id) REFERENCES warehouses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
