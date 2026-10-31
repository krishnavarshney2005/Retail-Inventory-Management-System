import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManagementApiService } from '../../../core/services/management-api.service';

interface InventoryItem {
  id: number;
  productSku: string;
  productName: string;
  warehouseName: string;
  binLocation: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  status: 'OPTIMAL' | 'LOW_STOCK' | 'SURPLUS';
}

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span>Logistics</span>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span class="current">Inventory Stock</span>
          </div>
          <h1 class="page-title">Inventory Stock &amp; Bins</h1>
          <p class="page-subtitle">Real-time stock on hand, reservations, bin location mapping, and multi-depot allocations.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary">
            <span class="material-symbols-outlined">sync_alt</span>
            <span>Stock Transfer</span>
          </button>
          <button class="btn btn-primary">
            <span class="material-symbols-outlined">tune</span>
            <span>Adjust Stock</span>
          </button>
        </div>
      </div>

      <!-- Filters & Warehouse Switcher -->
      <div class="filter-card">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Search by SKU, item name, or bin location..." 
            [(ngModel)]="searchQuery" 
          />
        </div>

        <div class="filter-selects">
          <select [(ngModel)]="selectedWarehouse" class="filter-select">
            <option value="ALL">All Facilities</option>
            <option value="Chicago Central Logistics Hub">Chicago Central Hub</option>
            <option value="Nevada Reno Regional Depot">Nevada Reno Depot</option>
            <option value="New Jersey Fulfillment Center">New Jersey Center</option>
          </select>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Warehouse Facility</th>
              <th>Bin Location</th>
              <th>On Hand</th>
              <th>Reserved</th>
              <th>Available to Promise</th>
              <th>Health Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (item of filteredItems(); track item.id) {
              <tr>
                <td>
                  <div class="product-cell">
                    <span class="product-name">{{ item.productName }}</span>
                    <span class="product-sku">{{ item.productSku }}</span>
                  </div>
                </td>
                <td>
                  <span class="warehouse-tag">{{ item.warehouseName }}</span>
                </td>
                <td>
                  <span class="bin-tag font-mono">{{ item.binLocation }}</span>
                </td>
                <td>
                  <span class="qty-num font-mono">{{ item.onHand }}</span>
                </td>
                <td>
                  <span class="qty-reserved font-mono">{{ item.reserved }}</span>
                </td>
                <td>
                  <span class="qty-avail font-mono font-bold">{{ item.available }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getHealthBadge(item.status)">
                    <span class="badge-dot"></span>
                    {{ item.status }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" title="Stock Transfer / Adjustment">
                      <span class="material-symbols-outlined">swap_horiz</span>
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
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-box { position: relative; flex: 1; min-width: 280px; display: flex; align-items: center; }
    .search-box .material-symbols-outlined { position: absolute; left: 0.875rem; color: var(--text-muted); font-size: 18px; }
    .search-box input {
      width: 100%;
      height: 38px;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 1rem 0 2.5rem;
      color: var(--text-main);
      font-size: 0.85rem;
      font-family: inherit;
    }

    .filter-selects { display: flex; gap: 0.75rem; }
    .filter-select {
      height: 38px;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 1rem;
      color: var(--text-main);
      font-size: 0.825rem;
      cursor: pointer;
    }

    .product-cell { display: flex; flex-direction: column; }
    .product-name { font-weight: 600; color: var(--text-main); }
    .product-sku { font-size: 0.725rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
    .warehouse-tag { font-size: 0.8rem; color: var(--text-secondary); }
    .bin-tag {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.75rem;
      color: #38bdf8;
    }

    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .font-bold { font-weight: 700; }
    .qty-num { color: var(--text-main); }
    .qty-reserved { color: var(--accent-amber); }
    .qty-avail { color: #34d399; }

    .action-buttons { display: flex; align-items: center; justify-content: flex-end; }
  `]
})
export class InventoryManagementComponent implements OnInit {
  readonly searchQuery = signal<string>('');
  readonly selectedWarehouse = signal<string>('ALL');

  readonly inventoryItems = signal<InventoryItem[]>([
    {
      id: 1,
      productSku: 'SKU-PHN-PRO15',
      productName: 'AeroPro 15 Ultra 256GB - Midnight',
      warehouseName: 'Chicago Central Logistics Hub',
      binLocation: 'Aisle 3 - Shelf B2',
      onHand: 45,
      reserved: 5,
      available: 40,
      reorderPoint: 30,
      status: 'OPTIMAL'
    },
    {
      id: 2,
      productSku: 'SKU-PHN-PRO15',
      productName: 'AeroPro 15 Ultra 256GB - Midnight',
      warehouseName: 'Nevada Reno Regional Depot',
      binLocation: 'Aisle 1 - Shelf A1',
      onHand: 28,
      reserved: 2,
      available: 26,
      reorderPoint: 30,
      status: 'OPTIMAL'
    },
    {
      id: 3,
      productSku: 'SKU-AUD-ANCPRO',
      productName: 'SonicWave ANC Wireless Headphones',
      warehouseName: 'Chicago Central Logistics Hub',
      binLocation: 'Aisle 4 - Shelf C1',
      onHand: 85,
      reserved: 12,
      available: 73,
      reorderPoint: 45,
      status: 'OPTIMAL'
    },
    {
      id: 4,
      productSku: 'SKU-AUD-BUDS',
      productName: 'PulseAir True Wireless Earbuds',
      warehouseName: 'Chicago Central Logistics Hub',
      binLocation: 'Aisle 4 - Shelf D2',
      onHand: 14,
      reserved: 0,
      available: 14,
      reorderPoint: 60,
      status: 'LOW_STOCK'
    },
    {
      id: 5,
      productSku: 'SKU-HOM-BLND01',
      productName: 'ChefMaster 1200W High-Speed Blender',
      warehouseName: 'Chicago Central Logistics Hub',
      binLocation: 'Aisle 8 - Shelf A3',
      onHand: 8,
      reserved: 2,
      available: 6,
      reorderPoint: 25,
      status: 'LOW_STOCK'
    }
  ]);
  private readonly api = inject(ManagementApiService);
  ngOnInit(): void { this.api.inventory(undefined, undefined, undefined, { size: 200 }).subscribe({ next: page => this.inventoryItems.set(page.content.map(i => ({ id:i.id, productSku:i.productSku, productName:i.productName, warehouseName:i.warehouseName, binLocation:i.binLocation || '', onHand:i.quantityOnHand, reserved:i.quantityReserved, available:i.quantityAvailable, reorderPoint:i.reorderPoint, status:i.isLowStock ? 'LOW_STOCK' : 'OPTIMAL' }))) }); }

  readonly filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const wh = this.selectedWarehouse();

    return this.inventoryItems().filter(item => {
      const matchQ = !q || 
        item.productName.toLowerCase().includes(q) || 
        item.productSku.toLowerCase().includes(q) ||
        item.binLocation.toLowerCase().includes(q);
      const matchWh = wh === 'ALL' || item.warehouseName === wh;
      return matchQ && matchWh;
    });
  });

  getHealthBadge(status: string): string {
    switch (status) {
      case 'OPTIMAL': return 'badge-success';
      case 'LOW_STOCK': return 'badge-danger';
      case 'SURPLUS': return 'badge-info';
      default: return 'badge-neutral';
    }
  }
}
