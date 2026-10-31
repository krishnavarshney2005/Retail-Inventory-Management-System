-- Makes legacy installations compatible with BaseEntity auditing and optimistic locking.
-- Each column check makes this safe for installations where Hibernate update was
-- previously run before Flyway was introduced.
DELIMITER $$
CREATE PROCEDURE add_retail_audit_columns()
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'inventory_transactions' AND column_name = 'updated_at') THEN
        ALTER TABLE inventory_transactions ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'inventory_transactions' AND column_name = 'version') THEN
        ALTER TABLE inventory_transactions ADD COLUMN version BIGINT DEFAULT 0 AFTER updated_at;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'order_items' AND column_name = 'updated_at') THEN
        ALTER TABLE order_items ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'order_items' AND column_name = 'version') THEN
        ALTER TABLE order_items ADD COLUMN version BIGINT DEFAULT 0 AFTER updated_at;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'stock_alerts' AND column_name = 'updated_at') THEN
        ALTER TABLE stock_alerts ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'stock_alerts' AND column_name = 'version') THEN
        ALTER TABLE stock_alerts ADD COLUMN version BIGINT DEFAULT 0 AFTER resolved_at;
    END IF;
END$$
DELIMITER ;

CALL add_retail_audit_columns();
DROP PROCEDURE add_retail_audit_columns;
