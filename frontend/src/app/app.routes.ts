import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';
import { CategoryManagementComponent } from './features/categories/category-management/category-management.component';
import { WarehouseManagementComponent } from './features/warehouses/warehouse-management/warehouse-management.component';
import { InventoryManagementComponent } from './features/inventory/inventory-management/inventory-management.component';
import { SupplierManagementComponent } from './features/suppliers/supplier-management/supplier-management.component';
import { OrderManagementComponent } from './features/orders/order-management/order-management.component';
import { ReportsComponent } from './features/reports/reports.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | RetailCore' },
      { path: 'products', component: ProductListComponent, title: 'Products | RetailCore' },
      { path: 'products/new', component: ProductFormComponent, title: 'Add Product | RetailCore' },
      { path: 'categories', component: CategoryManagementComponent, title: 'Categories | RetailCore' },
      { path: 'warehouses', component: WarehouseManagementComponent, title: 'Warehouses | RetailCore' },
      { path: 'inventory', component: InventoryManagementComponent, title: 'Inventory Stock | RetailCore' },
      { path: 'suppliers', component: SupplierManagementComponent, title: 'Suppliers | RetailCore' },
      { path: 'orders', component: OrderManagementComponent, title: 'Orders | RetailCore' },
      { path: 'reports', component: ReportsComponent, title: 'Reports & Alerts | RetailCore' },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
