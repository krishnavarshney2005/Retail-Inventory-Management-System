import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagementApiService } from '../../../core/services/management-api.service';

interface WarehouseItem {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacitySqft: number;
  usedSqft: number;
  manager: string;
  phone: string;
  email: string;
  activeItemsCount: number;
  status: 'ACTIVE' | 'MAINTENANCE';
}

@Component({
  selector: 'app-warehouse-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span>Logistics</span>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span class="current">Warehouses</span>
          </div>
          <h1 class="page-title">Warehouse Logistics &amp; Depots</h1>
          <p class="page-subtitle">Multi-location fulfillment facilities, storage capacity tracking, and regional hubs.</p>
        </div>
        <button class="btn btn-primary">
          <span class="material-symbols-outlined">add_business</span>
          <span>Add Warehouse</span>
        </button>
      </div>

      <!-- Warehouse Facility Cards Grid -->
      <div class="warehouse-grid">
        @for (wh of warehouses(); track wh.id) {
          <div class="warehouse-card">
            <div class="wh-header">
              <div class="wh-badge-code">
                <span class="material-symbols-outlined">warehouse</span>
                <span class="font-mono">{{ wh.code }}</span>
              </div>
              <span class="badge badge-success">
                <span class="badge-dot"></span>
                {{ wh.status }}
              </span>
            </div>

            <div class="wh-body">
              <h2 class="wh-name">{{ wh.name }}</h2>
              <p class="wh-address">
                <span class="material-symbols-outlined">pin_drop</span>
                {{ wh.address }}, {{ wh.city }}, {{ wh.state }}
              </p>

              <!-- Capacity Utilization Gauge -->
              <div class="utilization-box">
                <div class="util-meta">
                  <span class="util-title">Floor Space Utilization</span>
                  <span class="util-pct">{{ getUtilization(wh.usedSqft, wh.capacitySqft) }}%</span>
                </div>
                <div class="util-bar">
                  <div class="util-fill" [style.width.%]="getUtilization(wh.usedSqft, wh.capacitySqft)"></div>
                </div>
                <div class="util-sub">
                  <span>{{ wh.usedSqft.toLocaleString() }} sq ft in use</span>
                  <span>Max {{ wh.capacitySqft.toLocaleString() }} sq ft</span>
                </div>
              </div>

              <!-- Quick Metrics Grid -->
              <div class="wh-metrics-grid">
                <div class="wh-metric">
                  <span class="metric-title">Active SKUs</span>
                  <span class="metric-val">{{ wh.activeItemsCount }}</span>
                </div>
                <div class="wh-metric">
                  <span class="metric-title">Facility Manager</span>
                  <span class="metric-val text-sm">{{ wh.manager }}</span>
                </div>
              </div>
            </div>

            <div class="wh-footer">
              <a [href]="'mailto:' + wh.email" class="wh-contact-link">
                <span class="material-symbols-outlined">mail</span>
                {{ wh.email }}
              </a>
              <a routerLink="/inventory" class="btn btn-secondary btn-sm">Inspect Stock</a>
            </div>
          </div>
        }
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

    .warehouse-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.5rem;
    }

    .warehouse-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-md);
    }

    .warehouse-card:hover {
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
    }

    .wh-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .wh-badge-code {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-md);
      font-size: 0.775rem;
      font-weight: 600;
    }

    .wh-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      margin-top: 0.5rem;
    }

    .wh-address {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }

    .wh-address .material-symbols-outlined { font-size: 16px; color: var(--accent-rose); }

    .utilization-box {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-top: 1rem;
    }

    .util-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.775rem;
    }

    .util-title { color: var(--text-secondary); font-weight: 600; }
    .util-pct { color: #38bdf8; font-weight: 700; font-family: 'JetBrains Mono', monospace; }

    .util-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .util-fill {
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #6366f1);
      border-radius: var(--radius-full);
    }

    .util-sub {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .wh-metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .wh-metric {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.625rem;
      display: flex;
      flex-direction: column;
    }

    .metric-title { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
    .metric-val { font-size: 1.1rem; font-weight: 700; color: var(--text-main); font-family: 'JetBrains Mono', monospace; }
    .metric-val.text-sm { font-size: 0.825rem; font-family: inherit; }

    .wh-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 1rem;
    }

    .wh-contact-link {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-decoration: none;
    }

    .wh-contact-link:hover { color: var(--primary); }
    .wh-contact-link .material-symbols-outlined { font-size: 15px; }
  `]
})
export class WarehouseManagementComponent implements OnInit {
  readonly warehouses = signal<WarehouseItem[]>([
    {
      id: 1,
      code: 'WH-CENTRAL-01',
      name: 'Chicago Central Logistics Hub',
      address: '4400 Logistics Blvd',
      city: 'Chicago',
      state: 'IL',
      capacitySqft: 120000,
      usedSqft: 98400,
      manager: 'David Miller',
      phone: '+1-312-555-8801',
      email: 'wh-central@retailinventory.com',
      activeItemsCount: 1120,
      status: 'ACTIVE'
    },
    {
      id: 2,
      code: 'WH-WEST-02',
      name: 'Nevada Reno Regional Depot',
      address: '1250 Vista Commerce Pkwy',
      city: 'Reno',
      state: 'NV',
      capacitySqft: 85000,
      usedSqft: 54400,
      manager: 'Rachel Adams',
      phone: '+1-775-555-8802',
      email: 'wh-west@retailinventory.com',
      activeItemsCount: 680,
      status: 'ACTIVE'
    },
    {
      id: 3,
      code: 'WH-EAST-03',
      name: 'New Jersey Fulfillment Center',
      address: '800 Port Reading Ave',
      city: 'Carteret',
      state: 'NJ',
      capacitySqft: 95000,
      usedSqft: 86450,
      manager: 'Anthony Russo',
      phone: '+1-732-555-8803',
      email: 'wh-east@retailinventory.com',
      activeItemsCount: 940,
      status: 'ACTIVE'
    }
  ]);
  private readonly api = inject(ManagementApiService);
  ngOnInit(): void { this.api.warehouses(undefined, { size: 200 }).subscribe({ next: page => this.warehouses.set(page.content.map(w => ({ id:w.id, code:w.warehouseCode, name:w.name, address:w.address, city:w.city, state:w.state, capacitySqft:w.capacitySqft, usedSqft:0, manager:w.managerName || '', phone:w.phone || '', email:w.email || '', activeItemsCount:0, status:w.isActive ? 'ACTIVE' : 'MAINTENANCE' }))) }); }

  getUtilization(used: number, total: number): number {
    return Math.round((used / total) * 100);
  }
}
