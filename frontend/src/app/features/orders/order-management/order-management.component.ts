import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManagementApiService } from '../../../core/services/management-api.service';

interface OrderItem {
  id: number;
  orderNumber: string;
  type: 'PURCHASE_ORDER' | 'SALES_ORDER';
  partyName: string;
  warehouse: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span>Operations</span>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span class="current">Orders</span>
          </div>
          <h1 class="page-title">Order Management</h1>
          <p class="page-subtitle">Track inbound supplier purchase orders (POs) and outbound customer sales orders (SOs).</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary">
            <span class="material-symbols-outlined">receipt</span>
            <span>Invoices</span>
          </button>
          <button class="btn btn-primary">
            <span class="material-symbols-outlined">add</span>
            <span>Create Order</span>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-card">
        <div class="filter-tabs">
          <button class="tab-btn" [class.active]="selectedType() === 'ALL'" (click)="selectedType.set('ALL')">
            All Orders
          </button>
          <button class="tab-btn" [class.active]="selectedType() === 'PURCHASE_ORDER'" (click)="selectedType.set('PURCHASE_ORDER')">
            Purchase Orders (Inbound)
          </button>
          <button class="tab-btn" [class.active]="selectedType() === 'SALES_ORDER'" (click)="selectedType.set('SALES_ORDER')">
            Sales Orders (Outbound)
          </button>
        </div>
      </div>

      <!-- Orders Data Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Type</th>
              <th>Customer / Vendor</th>
              <th>Warehouse</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (ord of filteredOrders(); track ord.id) {
              <tr>
                <td>
                  <span class="font-mono text-bold">{{ ord.orderNumber }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="ord.type === 'PURCHASE_ORDER' ? 'badge-info' : 'badge-neutral'">
                    <span class="badge-dot"></span>
                    {{ ord.type === 'PURCHASE_ORDER' ? 'PURCHASE (PO)' : 'SALES (SO)' }}
                  </span>
                </td>
                <td>
                  <span class="party-name">{{ ord.partyName }}</span>
                </td>
                <td>
                  <span class="warehouse-tag">{{ ord.warehouse }}</span>
                </td>
                <td>
                  <span class="date-text">{{ ord.orderDate }}</span>
                </td>
                <td>
                  <span class="date-text">{{ ord.expectedDelivery }}</span>
                </td>
                <td>
                  <span class="amount-text font-mono">&#36;{{ ord.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getStatusBadge(ord.status)">
                    <span class="badge-dot"></span>
                    {{ ord.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" title="View Order Details">
                      <span class="material-symbols-outlined">visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
    .breadcrumb { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; }
    .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--primary); }
    .breadcrumb-separator { font-size: 15px; color: var(--text-muted); }
    .breadcrumb .current { color: var(--text-main); font-weight: 500; }
    .page-title { font-size: 1.625rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-main); }
    .page-subtitle { font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem; }
    .header-actions { display: flex; align-items: center; gap: 0.75rem; }

    .filter-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 0.75rem 1rem;
    }

    .filter-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .tab-btn:hover { color: var(--text-main); background: rgba(255, 255, 255, 0.04); }
    .tab-btn.active { background: var(--primary-light); color: var(--primary); }

    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .text-bold { font-weight: 700; color: var(--text-main); }
    .party-name { font-weight: 600; color: var(--text-main); font-size: 0.85rem; }
    .warehouse-tag { font-size: 0.8rem; color: var(--text-secondary); }
    .date-text { font-size: 0.775rem; color: var(--text-muted); }
    .amount-text { font-weight: 700; color: var(--text-main); }
    .action-buttons { display: flex; align-items: center; justify-content: flex-end; }
  `]
})
export class OrderManagementComponent implements OnInit {
  readonly selectedType = signal<string>('ALL');

  readonly orders = signal<OrderItem[]>([
    {
      id: 1,
      orderNumber: 'PO-2026-00101',
      type: 'PURCHASE_ORDER',
      partyName: 'Apex Electronics Global Ltd',
      warehouse: 'Chicago Central Hub',
      orderDate: '2026-10-15',
      expectedDelivery: '2026-10-22',
      totalAmount: 22500.00,
      status: 'COMPLETED'
    },
    {
      id: 2,
      orderNumber: 'PO-2026-00102',
      type: 'PURCHASE_ORDER',
      partyName: 'Modern Living Supplies Inc',
      warehouse: 'Chicago Central Hub',
      orderDate: '2026-10-28',
      expectedDelivery: '2026-11-05',
      totalAmount: 4400.00,
      status: 'PROCESSING'
    },
    {
      id: 3,
      orderNumber: 'SO-2026-00840',
      type: 'SALES_ORDER',
      partyName: 'Metro Retail Outlets',
      warehouse: 'Chicago Central Hub',
      orderDate: '2026-10-30',
      expectedDelivery: '2026-11-02',
      totalAmount: 4399.96,
      status: 'PROCESSING'
    }
  ]);
  private readonly api = inject(ManagementApiService);
  ngOnInit(): void { this.api.orders(undefined, undefined, { size: 200 }).subscribe({ next: page => this.orders.set(page.content.map(o => ({ id:o.id, orderNumber:o.orderNumber, type:o.orderType === 'PURCHASE' ? 'PURCHASE_ORDER' : 'SALES_ORDER', partyName:o.supplierName || 'Customer order', warehouse:o.warehouseCode, orderDate:o.orderDate, expectedDelivery:o.expectedDeliveryDate || '', totalAmount:o.totalAmount, status:o.status as OrderItem['status'] }))) }); }

  readonly filteredOrders = computed(() => {
    const t = this.selectedType();
    if (t === 'ALL') return this.orders();
    return this.orders().filter(o => o.type === t);
  });

  getStatusBadge(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'PROCESSING': return 'badge-info';
      case 'PENDING': return 'badge-warning';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-neutral';
    }
  }
}
