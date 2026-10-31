# Retail Inventory Management System - Database Setup

This folder contains the complete relational schema and optional seed data for MySQL 8.0+.
The Spring Boot application manages schema evolution with Flyway migrations in
`backend/src/main/resources/db/migration`; use these scripts for manual setup or sample data.

## Prerequisites
- MySQL Server 8.0 or later installed and running on `localhost:3306`.
- Root or privileged MySQL user credentials.

## Setup Steps

### Option A: Using MySQL Command Line Client
```bash
# 1. Connect to MySQL as root
mysql -u root -p

# 2. Run the schema creation script
source d:/Invertory_Management_System_project/database/schema.sql;

# 3. Load the sample retail seed data
source d:/Invertory_Management_System_project/database/data.sql;

# 4. Verify tables
USE retail_inventory_db;
SHOW TABLES;
```

### Option B: Using MySQL Workbench or DBeaver
1. Connect to your MySQL server.
2. Open `schema.sql` and execute the entire script.
3. Open `data.sql` and execute the entire script.

## Database Entities Included
- `categories`: Multi-level hierarchical retail product categories.
- `suppliers`: Supplier directory with contact details and tax IDs.
- `warehouses`: Physical logistics centers and distribution depots.
- `products`: SKU, barcode, unit pricing, cost pricing, and stock bounds.
- `inventories`: Real-time stock on hand, reservations, and calculated availability.
- `inventory_transactions`: Complete immutable audit ledger of every stock movement.
- `orders`: Purchase orders (POs) and customer sales orders (SOs).
- `order_items`: Line items linking orders to products with unit prices and subtotals.
- `stock_alerts`: Automated safety stock alerts and notifications.
