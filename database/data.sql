-- ====================================================================
-- Retail Inventory Management System
-- Seed / Sample Data Script
-- ====================================================================

USE retail_inventory_db;

-- 1. Categories
INSERT INTO categories (id, name, code, description, parent_id, is_active) VALUES
(1, 'Consumer Electronics', 'CAT-ELEC', 'Smartphones, laptops, accessories, and gadgets', NULL, TRUE),
(2, 'Apparel & Footwear', 'CAT-APPR', 'Men, women, and kids apparel, athletic wear, and footwear', NULL, TRUE),
(3, 'Home & Kitchen', 'CAT-HOME', 'Appliances, cookware, storage, and home decor', NULL, TRUE),
(4, 'Health & Personal Care', 'CAT-HLTH', 'Wellness products, personal grooming, and essentials', NULL, TRUE),
(5, 'Smartphones & Tablets', 'CAT-ELEC-PHN', 'Flagship mobile devices and tablets', 1, TRUE),
(6, 'Audio & Accessories', 'CAT-ELEC-AUD', 'Headphones, earbuds, and chargers', 1, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Suppliers
INSERT INTO suppliers (id, company_name, supplier_code, contact_person, email, phone, address, city, state, country, postal_code, tax_id, is_active) VALUES
(1, 'Apex Electronics Global Ltd', 'SUP-APEX-01', 'Elena Rostova', 'contact@apexelectronics.com', '+1-415-555-0199', '100 Silicon Way, Suite 400', 'San Jose', 'CA', 'USA', '95134', 'US-EIN-9823412', TRUE),
(2, 'Vanguard Textile & Garments', 'SUP-VANG-02', 'Marcus Chen', 'orders@vanguardtextile.com', '+1-212-555-0144', '742 Fashion Blvd, 5th Floor', 'New York', 'NY', 'USA', '10018', 'US-EIN-1294821', TRUE),
(3, 'Modern Living Supplies Inc', 'SUP-MODL-03', 'Sarah Jenkins', 'supply@modernliving.com', '+1-312-555-0177', '550 Michigan Ave', 'Chicago', 'IL', 'USA', '60611', 'US-EIN-5593810', TRUE)
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

-- 3. Warehouses
INSERT INTO warehouses (id, warehouse_code, name, address, city, state, country, postal_code, capacity_sqft, manager_name, phone, email, is_active) VALUES
(1, 'WH-CENTRAL-01', 'Chicago Central Logistics Hub', '4400 Logistics Blvd', 'Chicago', 'IL', 'USA', '60638', 120000, 'David Miller', '+1-312-555-8801', 'wh-central@retailinventory.com', TRUE),
(2, 'WH-WEST-02', 'Nevada Reno Regional Depot', '1250 Vista Commerce Pkwy', 'Reno', 'NV', 'USA', '89502', 85000, 'Rachel Adams', '+1-775-555-8802', 'wh-west@retailinventory.com', TRUE),
(3, 'WH-EAST-03', 'New Jersey Fulfillment Center', '800 Port Reading Ave', 'Carteret', 'NJ', 'USA', '07008', 95000, 'Anthony Russo', '+1-732-555-8803', 'wh-east@retailinventory.com', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Products
INSERT INTO products (id, sku, barcode, name, description, category_id, cost_price, unit_price, min_stock_level, max_stock_level, reorder_point, unit_of_measure, is_active) VALUES
(1, 'SKU-PHN-PRO15', '079357319201', 'AeroPro 15 Ultra 256GB - Midnight', 'Next-gen flagship smartphone with OLED display and titanium chassis', 5, 750.00, 1099.99, 15, 200, 30, 'UNIT', TRUE),
(2, 'SKU-AUD-ANCPRO', '079357319202', 'SonicWave ANC Wireless Headphones', 'Active noise cancelling over-ear headphones with 40h battery life', 6, 95.00, 199.99, 20, 350, 45, 'UNIT', TRUE),
(3, 'SKU-AUD-BUDS', '079357319203', 'PulseAir True Wireless Earbuds', 'Compact waterproof earbuds with wireless charging case', 6, 32.00, 79.99, 30, 500, 60, 'UNIT', TRUE),
(4, 'SKU-APP-JKT01', '079357319204', 'All-Weather Technical Parka - Navy / L', 'Waterproof breathable shell jacket with sealed seams', 2, 60.00, 149.99, 10, 150, 20, 'UNIT', TRUE),
(5, 'SKU-HOM-BLND01', '079357319205', 'ChefMaster 1200W High-Speed Blender', 'Commercial-grade blender with 64oz BPA-free jar', 3, 52.00, 119.99, 12, 180, 25, 'UNIT', TRUE),
(6, 'SKU-HOM-AIRF02', '079357319206', 'AeroCrisp 6-Quart Digital Air Fryer', 'Touchscreen 8-in-1 convection air fryer with rapid heating', 3, 44.00, 99.99, 15, 220, 30, 'UNIT', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. Inventories
INSERT INTO inventories (id, product_id, warehouse_id, quantity_on_hand, quantity_reserved, bin_location, last_counted_at) VALUES
(1, 1, 1, 45, 5, 'Aisle 3 - Shelf B2', NOW()),
(2, 1, 2, 28, 2, 'Aisle 1 - Shelf A1', NOW()),
(3, 2, 1, 85, 12, 'Aisle 4 - Shelf C1', NOW()),
(4, 2, 3, 60, 4, 'Aisle 2 - Shelf B3', NOW()),
(5, 3, 1, 14, 0, 'Aisle 4 - Shelf D2', NOW()), -- Low stock!
(6, 4, 1, 42, 6, 'Rack 12 - Bay 4', NOW()),
(7, 5, 1, 8, 2, 'Aisle 8 - Shelf A3', NOW()),  -- Low stock!
(8, 6, 3, 50, 8, 'Aisle 9 - Shelf C2', NOW())
ON DUPLICATE KEY UPDATE quantity_on_hand=VALUES(quantity_on_hand);

-- 6. Sample Stock Alerts (for dashboard low-stock preview)
INSERT INTO stock_alerts (id, product_id, warehouse_id, alert_type, current_quantity, threshold_quantity, status, notes) VALUES
(1, 3, 1, 'LOW_STOCK', 14, 30, 'ACTIVE', 'Inventory dropped below minimum safety stock of 30 units'),
(2, 5, 1, 'LOW_STOCK', 8, 12, 'ACTIVE', 'Urgent reorder required. Available quantity is only 6 units after reservation')
ON DUPLICATE KEY UPDATE current_quantity=VALUES(current_quantity);

-- 7. Sample Orders
INSERT INTO orders (id, order_number, order_type, supplier_id, warehouse_id, customer_name, customer_email, status, total_amount, tax_amount, shipping_amount, order_date, expected_delivery_date, notes) VALUES
(1, 'PO-2026-00101', 'PURCHASE_ORDER', 1, 1, NULL, NULL, 'COMPLETED', 22500.00, 0.00, 350.00, '2026-10-15', '2026-10-22', 'Q4 replenishment for AeroPro 15'),
(2, 'PO-2026-00102', 'PURCHASE_ORDER', 3, 1, NULL, NULL, 'PROCESSING', 4400.00, 0.00, 120.00, '2026-10-28', '2026-11-05', 'Restocking ChefMaster Blenders'),
(3, 'SO-2026-00840', 'SALES_ORDER', NULL, 1, 'Metro Retail Outlets', 'purchasing@metroretail.com', 'PROCESSING', 4399.96, 352.00, 85.00, '2026-10-30', '2026-11-02', 'Standard delivery to downtown branch')
ON DUPLICATE KEY UPDATE total_amount=VALUES(total_amount);

-- 8. Sample Order Items
INSERT INTO order_items (id, order_id, product_id, quantity_ordered, quantity_received, unit_price, subtotal) VALUES
(1, 1, 1, 30, 30, 750.00, 22500.00),
(2, 2, 5, 50, 0, 52.00, 2600.00),
(3, 3, 1, 4, 0, 1099.99, 4399.96)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);
