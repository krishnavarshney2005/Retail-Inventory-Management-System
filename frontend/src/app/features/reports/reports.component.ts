import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagementApiService } from '../../core/services/management-api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span>Analytics</span>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span class="current">Reports &amp; Alerts</span>
          </div>
          <h1 class="page-title">Reports &amp; Safety Stock Alerts</h1>
          <p class="page-subtitle">Inventory valuation analytics, reorder triggers, stockout prevention, and turnover rates.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary">
            <span class="material-symbols-outlined">print</span>
            <span>Print Report</span>
          </button>
          <button class="btn btn-primary">
            <span class="material-symbols-outlined">file_download</span>
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      <!-- Critical Low-Stock Alerts Warning Panel -->
      <div class="alerts-banner">
        <div class="alerts-banner-header">
          <div class="alert-icon-wrap">
            <span class="material-symbols-outlined">notification_important</span>
          </div>
          <div>
            <h2 class="alert-banner-title">2 Items Require Immediate Replenishment</h2>
            <p class="alert-banner-desc">Stock levels have fallen below safety reorder points at Chicago Central Logistics Hub.</p>
          </div>
        </div>

        <div class="alert-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Warehouse</th>
                <th>Available</th>
                <th>Reorder Level</th>
                <th>Deficit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PulseAir True Wireless Earbuds</strong></td>
                <td><span class="font-mono">SKU-AUD-BUDS</span></td>
                <td>Chicago Central Hub</td>
                <td><span class="text-rose font-bold">14 units</span></td>
                <td>60 units</td>
                <td><span class="badge badge-danger">-46 units</span></td>
                <td>
                  <a routerLink="/orders" class="btn btn-primary btn-sm">Draft PO</a>
                </td>
              </tr>
              <tr>
                <td><strong>ChefMaster 1200W High-Speed Blender</strong></td>
                <td><span class="font-mono">SKU-HOM-BLND01</span></td>
                <td>Chicago Central Hub</td>
                <td><span class="text-rose font-bold">6 units</span></td>
                <td>25 units</td>
                <td><span class="badge badge-danger">-19 units</span></td>
                <td>
                  <a routerLink="/orders" class="btn btn-primary btn-sm">Draft PO</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inventory Valuation Breakdown -->
      <div class="grid-card">
        <h2 class="card-title">Category Stock Valuation &amp; Share</h2>
        <div class="valuation-grid">
          <div class="val-card">
            <span class="val-title">Consumer Electronics</span>
            <span class="val-amount">$784,200</span>
            <span class="val-sub">61% of Total Inventory</span>
          </div>
          <div class="val-card">
            <span class="val-title">Apparel &amp; Footwear</span>
            <span class="val-amount">$245,600</span>
            <span class="val-sub">19% of Total Inventory</span>
          </div>
          <div class="val-card">
            <span class="val-title">Home &amp; Kitchen</span>
            <span class="val-amount">$186,400</span>
            <span class="val-sub">14% of Total Inventory</span>
          </div>
          <div class="val-card">
            <span class="val-title">Health &amp; Personal Care</span>
            <span class="val-amount">$68,320</span>
            <span class="val-sub">6% of Total Inventory</span>
          </div>
        </div>
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

    .alerts-banner {
      background: rgba(244, 63, 94, 0.05);
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .alerts-banner-header { display: flex; align-items: center; gap: 1rem; }
    .alert-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: rgba(244, 63, 94, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-rose);
    }
    .alert-icon-wrap .material-symbols-outlined { font-size: 24px; }
    .alert-banner-title { font-size: 1.15rem; font-weight: 700; color: var(--text-main); }
    .alert-banner-desc { font-size: 0.825rem; color: var(--text-secondary); margin-top: 0.15rem; }

    .font-mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
    .font-bold { font-weight: 700; }
    .text-rose { color: var(--accent-rose); }

    .grid-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }
    .card-title { font-size: 1.125rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.25rem; }

    .valuation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .val-card {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .val-title { font-size: 0.775rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; }
    .val-amount { font-size: 1.5rem; font-weight: 800; color: var(--text-main); font-family: 'JetBrains Mono', monospace; }
    .val-sub { font-size: 0.725rem; color: #38bdf8; }
  `]
})
export class ReportsComponent implements OnInit {
  private readonly api = inject(ManagementApiService);
  inventoryValuation = 0;
  inventoryRows: any[] = [];
  ngOnInit(): void { this.api.report().subscribe({ next: report => { this.inventoryValuation = report.inventoryValuation || 0; this.inventoryRows = report.inventory || []; } }); }
}
