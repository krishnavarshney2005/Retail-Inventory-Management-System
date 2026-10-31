# Retail Inventory Management System (RetailCore)

A web-based, full-stack Retail Inventory Management System built with **Spring Boot 3 (Java 17)**, **MySQL**, **Angular + TypeScript**, and **Angular Material**.

---

## 📁 Project Architecture & Directory Structure

```
Retail-Inventory-Management/
├── backend/                  # Spring Boot 3 + Java 17 REST API
│   ├── src/main/java/com/retail/inventory/
│   │   ├── config/           # CORS, OpenAPI/Swagger, WebMvc configuration
│   │   ├── controller/       # REST API Controllers (@RestController)
│   │   ├── dto/              # Request / Response transfer objects
│   │   ├── entity/           # JPA Entities with Auditing (@Entity)
│   │   ├── exception/        # Global Exception Handler & Custom Exceptions
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   └── service/          # Business logic interfaces & service.impl
│   ├── src/main/resources/
│   │   └── application.properties # MySQL datasource, Hibernate & CORS settings
│   └── pom.xml               # Maven build dependencies
│
├── frontend/                 # Modern Angular + TypeScript Admin Portal
│   ├── src/app/
│   │   ├── core/             # HTTP API Services, Models & Interfaces
│   │   ├── layout/           # Sidebar, Navbar & Admin Layout Shell
│   │   └── features/         # Modular Components:
│   │       ├── dashboard/    # KPI metrics, Stock movements, Low-stock alerts
│   │       ├── products/     # Product List & Product Creation Form
│   │       ├── categories/   # Hierarchical Category Management
│   │       ├── warehouses/   # Warehouse Facilities & Space Utilization
│   │       ├── inventory/    # Stock on Hand, Reserved, Available & Bins
│   │       ├── suppliers/    # Vendor directory & Procurement routing
│   │       ├── orders/       # Purchase Orders (Inbound) & Sales Orders (Outbound)
│   │       └── reports/      # Safety Stock Alerts & Valuation Reports
│   ├── src/styles.scss       # Dark-mode-first custom CSS design system
│   └── angular.json          # Angular CLI workspace configuration
│
└── database/                 # MySQL 8.0+ Database Scripts
    ├── schema.sql            # Complete DDL tables, foreign keys & indexes
    ├── data.sql              # Realistic seed data for all 8 modules
    └── README.md             # Database import instructions
```

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)
Make sure MySQL 8.0+ is running on `localhost:3306`. The standard database name is
`retail_inventory_db`.

The backend uses Flyway for schema migrations. On a new database, starting the backend
creates the schema. Existing installations are baselined at version 1 and receive
non-destructive compatibility migrations. The scripts below remain available for a
manual setup or to load the optional sample data:

```bash
# Connect to MySQL
mysql -u root -p

# Optional manual schema and sample data setup
source d:/Invertory_Management_System_project/database/schema.sql;
source d:/Invertory_Management_System_project/database/data.sql;
```

---

### 2. Backend Application (Spring Boot 3 + Java 17)
Navigate to the `backend/` directory:

```bash
cd d:\Invertory_Management_System_project\backend

# Build the project
mvn clean compile

# Run the Spring Boot REST API
mvn spring-boot:run
```

- **Base URL:** `http://localhost:8080/api`
- **Health / System Status:** `http://localhost:8080/api/v1/system/status`
- **Heartbeat Ping:** `http://localhost:8080/api/v1/system/ping`
- **Swagger / OpenAPI UI:** `http://localhost:8080/api/swagger-ui.html`

---

### 3. Frontend Application (Angular + TypeScript)
Navigate to the `frontend/` directory:

```bash
cd d:\Invertory_Management_System_project\frontend

# Start the Angular development server
npm start
# (or: ng serve --open)
```

- **Frontend URL:** `http://localhost:4200`
- The Angular navbar features a live connectivity indicator that communicates with the Spring Boot backend via HTTP REST.
