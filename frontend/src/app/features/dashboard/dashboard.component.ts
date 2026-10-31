import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemApiService } from '../../core/services/system-api.service';
import { ManagementApiService } from '../../core/services/management-api.service';

interface StatKpi {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  colorClass: string;
}

interface StockAlertItem {
  sku: string;
  name: string;
  warehouse: string;
  currentStock: number;
  reorderPoint: number;
  status: string;
}

interface RecentMovement {
  id: string;
  sku: string;
  productName: string;
  warehouse: string;
  type: string;
  typeClass: string;
  qty: string;
  date: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Page Header -->
      <div class="dashboard-header">
        <div>
          <div class="badge badge-info mb-2">
            <span class="badge-dot"></span>
            Enterprise Retail v1.0
          </div>
          <h1 class="page-title">Operations & Inventory Dashboard</h1>
          <p class="page-subtitle">Real-time visibility across catalog, multi-warehouse stock levels, and fulfillment.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="systemApi.checkHealth().subscribe()">
            <span class="material-symbols-outlined">refresh</span>
            <span>Check API Health</span>
          </button>
          <a routerLink="/products/new" class="btn btn-primary">
            <span class="material-symbols-outlined">add_box</span>
            <span>New Product</span>
          </a>
        </div>
      </div>

      <!-- Live Spring Boot & MySQL Connectivity Banner -->
      <div class="connection-banner" [class.connected]="systemApi.isConnected()">
        <div class="banner-content">
          <div class="banner-icon-box">
            <span class="material-symbols-outlined banner-icon">
              {{ systemApi.isConnected() ? 'dns' : 'cloud_off' }}
            </span>
          </div>
          <div class="banner-text">
            <div class="banner-title">
              @if (systemApi.isConnected()) {
                Spring Boot REST API Connected &amp; Auditing Enabled
              } @else {
                Spring Boot Backend Offline (Running on http://localhost:8080/api)
              }
            </div>
            <div class="banner-sub">
              @if (systemApi.isConnected()) {
                Database: MySQL 8.0 &bull; Java: {{ systemApi.systemInfo()?.javaVersion || '17' }} &bull; Layered Architecture Active
              } @else {
                Start the backend application with <code>mvn spring-boot:run</code> inside <code>/backend</code>
              }
            </div>
          </div>
        </div>
        <div class="banner-status">
          <span class="badge" [ngClass]="systemApi.isConnected() ? 'badge-success' : 'badge-danger'">
            <span class="badge-dot"></span>
            {{ systemApi.isConnected() ? 'ONLINE' : 'DISCONNECTED' }}
          </span>
        </div>
      </div>

      <!-- Statistics KPI Cards -->
      <div class="stats-grid">
        @for (stat of stats; track stat.title) {
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-title">{{ stat.title }}</span>
              <div class="stat-icon-wrap" [ngClass]="stat.colorClass">
                <span class="material-symbols-outlined">{{ stat.icon }}</span>
              </div>
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-footer">
              <span class="stat-trend" [class.positive]="stat.isPositive" [class.negative]="!stat.isPositive">
                <span class="material-symbols-outlined trend-icon">{{ stat.isPositive ? 'trending_up' : 'trending_down' }}</span>
                {{ stat.change }}
              </span>
              <span class="stat-period">vs last month</span>
            </div>
          </div>
        }
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Left: Recent Stock Movements & Transactions -->
        <div class="grid-card recent-activity">
          <div class="card-header">
            <div>
              <h2 class="card-title">Live Stock Movements</h2>
              <p class="card-desc">Latest incoming shipments, store dispatches, and inventory adjustments.</p>
            </div>
            <a routerLink="/inventory" class="btn btn-secondary btn-sm">View All Stock</a>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product &amp; SKU</th>
                  <th>Warehouse</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Timestamp</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (mov of recentMovements; track mov.id) {
                  <tr>
                    <td>
                      <div class="product-cell">
                        <span class="product-name">{{ mov.productName }}</span>
                        <span class="product-sku">{{ mov.sku }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="warehouse-tag">{{ mov.warehouse }}</span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="mov.typeClass">
                        <span class="badge-dot"></span>
                        {{ mov.type }}
                      </span>
                    </td>
                    <td>
                      <span class="qty-text" [class.qty-positive]="mov.qty.startsWith('+')" [class.qty-negative]="mov.qty.startsWith('-')">
                        {{ mov.qty }}
                      </span>
                    </td>
                    <td>
                      <span class="timestamp-text">{{ mov.date }}</span>
                    </td>
                    <td>
                      <button class="btn-icon" title="View Transaction Ledger">
                        <span class="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right: Critical Low-Stock Alerts & Warehouse Capacity -->
        <div class="dashboard-side-column">
          <!-- Critical Low-Stock Alerts Card -->
          <div class="grid-card alerts-card">
            <div class="card-header">
              <div>
                <h2 class="card-title">Low Stock Alerts</h2>
                <p class="card-desc">Items currently below minimum safety stock threshold.</p>
              </div>
              <span class="badge badge-danger">
                <span class="badge-dot"></span>
                2 Critical
              </span>
            </div>

            <div class="alerts-list">
              @for (alert of lowStockAlerts; track alert.sku) {
                <div class="alert-item">
                  <div class="alert-item-header">
                    <span class="alert-product-name">{{ alert.name }}</span>
                    <span class="alert-sku">{{ alert.sku }}</span>
                  </div>
                  
                  <div class="alert-progress-wrapper">
                    <div class="alert-progress-bar">
                      <div class="progress-fill" [style.width.%]="(alert.currentStock / alert.reorderPoint) * 100"></div>
                    </div>
                    <div class="alert-stock-metrics">
                      <span class="stock-current">Stock: <strong>{{ alert.currentStock }} units</strong></span>
                      <span class="stock-threshold">Reorder point: {{ alert.reorderPoint }}</span>
                    </div>
                  </div>

                  <div class="alert-actions">
                    <span class="alert-location">
                      <span class="material-symbols-outlined">location_on</span>
                      {{ alert.warehouse }}
                    </span>
                    <a routerLink="/orders" class="btn btn-primary btn-sm reorder-btn">
                      <span class="material-symbols-outlined">shopping_cart</span>
                      Reorder
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Warehouse Capacity Card -->
          <div class="grid-card warehouse-card">
            <div class="card-header">
              <h2 class="card-title">Warehouse Utilization</h2>
              <a routerLink="/warehouses" class="card-link">Manage</a>
            </div>

            <div class="warehouse-list">
              <div class="wh-item">
                <div class="wh-meta">
                  <span class="wh-name">Chicago Central Logistics Hub</span>
                  <span class="wh-pct">82%</span>
                </div>
                <div class="wh-bar"><div class="wh-bar-fill fill-blue" style="width: 82%;"></div></div>
                <span class="wh-capacity">98,400 / 120,000 sq ft</span>
              </div>

              <div class="wh-item">
                <div class="wh-meta">
                  <span class="wh-name">Nevada Reno Regional Depot</span>
                  <span class="wh-pct">64%</span>
                </div>
                <div class="wh-bar"><div class="wh-bar-fill fill-emerald" style="width: 64%;"></div></div>
                <span class="wh-capacity">54,400 / 85,000 sq ft</span>
              </div>

              <div class="wh-item">
                <div class="wh-meta">
                  <span class="wh-name">New Jersey Fulfillment Center</span>
                  <span class="wh-pct">91%</span>
                </div>
                <div class="wh-bar"><div class="wh-bar-fill fill-rose" style="width: 91%;"></div></div>
                <span class="wh-capacity">86,450 / 95,000 sq ft &bull; High Density</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .dashboard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text-main);
      margin-top: 0.25rem;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mb-2 {
      margin-bottom: 0.5rem;
    }

    /* Connection Banner */
    .connection-banner {
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.25);
      border-radius: var(--radius-lg);
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      transition: all var(--transition-normal);
    }

    .connection-banner.connected {
      background: rgba(16, 185, 129, 0.08);
      border-color: rgba(16, 185, 129, 0.25);
    }

    .banner-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .banner-icon-box {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .connected .banner-icon-box {
      background: rgba(16, 185, 129, 0.2);
    }

    .banner-icon {
      font-size: 22px;
      color: var(--accent-rose);
    }

    .connected .banner-icon {
      color: var(--accent-emerald);
    }

    .banner-title {
      font-size: 0.925rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .banner-sub {
      font-size: 0.775rem;
      color: var(--text-secondary);
      margin-top: 0.15rem;
    }

    .banner-sub code {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.25rem 1.5rem;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-normal);
      display: flex;
      flex-direction: column;
    }

    .stat-card:hover {
      border-color: rgba(99, 102, 241, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    }

    .stat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .stat-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-wrap.indigo { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .stat-icon-wrap.cyan { background: rgba(6, 182, 212, 0.15); color: #38bdf8; }
    .stat-icon-wrap.emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .stat-icon-wrap.rose { background: rgba(244, 63, 94, 0.15); color: #fb7185; }

    .stat-value {
      font-size: 1.875rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-main);
      margin-bottom: 0.5rem;
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      font-weight: 700;
    }

    .stat-trend.positive { color: var(--accent-emerald); }
    .stat-trend.negative { color: var(--accent-rose); }

    .trend-icon { font-size: 15px; }
    .stat-period { color: var(--text-muted); }

    /* Dashboard Layout Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 1200px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    .grid-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .card-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }

    .card-link {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary);
      text-decoration: none;
    }

    .card-link:hover { text-decoration: underline; }

    .btn-sm {
      padding: 0.4rem 0.75rem;
      font-size: 0.75rem;
    }

    /* Product Cell */
    .product-cell {
      display: flex;
      flex-direction: column;
    }

    .product-name {
      font-weight: 600;
      color: var(--text-main);
    }

    .product-sku {
      font-size: 0.725rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .warehouse-tag {
      font-size: 0.775rem;
      color: var(--text-secondary);
    }

    .qty-text {
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .qty-positive { color: var(--accent-emerald); }
    .qty-negative { color: var(--accent-rose); }

    .timestamp-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Side Column */
    .dashboard-side-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Low Stock Alerts */
    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .alert-item {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .alert-item-header {
      display: flex;
      flex-direction: column;
    }

    .alert-product-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--text-main);
    }

    .alert-sku {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .alert-progress-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .alert-progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--accent-rose);
      border-radius: var(--radius-full);
    }

    .alert-stock-metrics {
      display: flex;
      justify-content: space-between;
      font-size: 0.725rem;
      color: var(--text-secondary);
    }

    .stock-current strong {
      color: var(--accent-rose);
    }

    .alert-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-subtle);
    }

    .alert-location {
      font-size: 0.725rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .alert-location .material-symbols-outlined {
      font-size: 14px;
    }

    .reorder-btn {
      padding: 0.3rem 0.65rem;
      font-size: 0.75rem;
    }

    /* Warehouse list */
    .warehouse-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .wh-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .wh-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
    }

    .wh-name {
      font-weight: 600;
      color: var(--text-main);
    }

    .wh-pct {
      font-weight: 700;
      color: var(--text-secondary);
    }

    .wh-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .wh-bar-fill {
      height: 100%;
      border-radius: var(--radius-full);
    }

    .fill-blue { background: #38bdf8; }
    .fill-emerald { background: #34d399; }
    .fill-rose { background: #fb7185; }

    .wh-capacity {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
  `]
})
export class DashboardComponent implements OnInit {
  readonly systemApi = inject(SystemApiService);
  readonly managementApi = inject(ManagementApiService);

  stats: StatKpi[] = [
    {
      title: 'Total Stock Valuation',
      value: '$1,284,520',
      change: '+12.4%',
      isPositive: true,
      icon: 'payments',
      colorClass: 'indigo'
    },
    {
      title: 'Active Catalog SKUs',
      value: '1,480',
      change: '+48 items',
      isPositive: true,
      icon: 'inventory_2',
      colorClass: 'cyan'
    },
    {
      title: 'Operational Hubs',
      value: '3 Centers',
      change: '94.2% Capacity',
      isPositive: true,
      icon: 'warehouse',
      colorClass: 'emerald'
    },
    {
      title: 'Low Stock Alerts',
      value: '2 Items',
      change: 'Action Required',
      isPositive: false,
      icon: 'warning',
      colorClass: 'rose'
    }
  ];

  recentMovements: RecentMovement[] = [
    {
      id: 'TX-101',
      sku: 'SKU-PHN-PRO15',
      productName: 'AeroPro 15 Ultra 256GB - Midnight',
      warehouse: 'Chicago Central Hub',
      type: 'Purchase Receipt',
      typeClass: 'badge-success',
      qty: '+30 units',
      date: 'Today, 14:20'
    },
    {
      id: 'TX-102',
      sku: 'SKU-AUD-ANCPRO',
      productName: 'SonicWave ANC Headphones',
      warehouse: 'New Jersey Center',
      type: 'Store Dispatch',
      typeClass: 'badge-info',
      qty: '-12 units',
      date: 'Today, 11:45'
    },
    {
      id: 'TX-103',
      sku: 'SKU-APP-JKT01',
      productName: 'Technical Parka - Navy / L',
      warehouse: 'Nevada Reno Hub',
      type: 'Stock Transfer',
      typeClass: 'badge-neutral',
      qty: '+15 units',
      date: 'Yesterday, 17:10'
    },
    {
      id: 'TX-104',
      sku: 'SKU-HOM-BLND01',
      productName: 'ChefMaster 1200W Blender',
      warehouse: 'Chicago Central Hub',
      type: 'Stock Adjustment',
      typeClass: 'badge-warning',
      qty: '-2 units',
      date: 'Oct 29, 09:30'
    }
  ];

  lowStockAlerts: StockAlertItem[] = [
    {
      sku: 'SKU-AUD-BUDS',
      name: 'PulseAir True Wireless Earbuds',
      warehouse: 'Chicago Central Hub',
      currentStock: 14,
      reorderPoint: 60,
      status: 'CRITICAL'
    },
    {
      sku: 'SKU-HOM-BLND01',
      name: 'ChefMaster 1200W High-Speed Blender',
      warehouse: 'Chicago Central Hub',
      currentStock: 8,
      reorderPoint: 25,
      status: 'CRITICAL'
    }
  ];

  ngOnInit(): void {
    this.systemApi.checkHealth().subscribe();
    this.managementApi.dashboard().subscribe({ next: dashboard => {
      this.stats = [
        { title: 'Inventory Units', value: dashboard.totalInventoryUnits.toLocaleString(), change: `${dashboard.totalProducts} products`, isPositive: true, icon: 'inventory_2', colorClass: 'indigo' },
        { title: 'Active Categories', value: dashboard.totalCategories.toString(), change: `${dashboard.totalSuppliers} suppliers`, isPositive: true, icon: 'category', colorClass: 'cyan' },
        { title: 'Operational Hubs', value: dashboard.totalWarehouses.toString(), change: 'Database-backed', isPositive: true, icon: 'warehouse', colorClass: 'emerald' },
        { title: 'Low Stock Alerts', value: dashboard.lowStockProducts.toString(), change: dashboard.lowStockProducts ? 'Action required' : 'All clear', isPositive: dashboard.lowStockProducts === 0, icon: 'warning', colorClass: 'rose' }
      ];
      this.recentMovements = dashboard.recentTransactions.map((item: any) => ({ id: item.transactionCode, sku: '', productName: item.productName, warehouse: item.warehouseName, type: item.type.replace(/_/g, ' '), typeClass: 'badge-info', qty: `${item.quantity >= 0 ? '+' : ''}${item.quantity} units`, date: new Date(item.createdAt).toLocaleString() }));
    }});
    this.managementApi.lowStock().subscribe({ next: rows => this.lowStockAlerts = rows.map(row => ({ sku: row.productSku, name: row.productName, warehouse: row.warehouseName, currentStock: row.quantityAvailable, reorderPoint: row.reorderPoint, status: row.quantityAvailable <= 0 ? 'OUT OF STOCK' : 'LOW STOCK' })) });
  }
}
