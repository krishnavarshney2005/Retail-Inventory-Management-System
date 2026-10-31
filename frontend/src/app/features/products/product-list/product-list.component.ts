import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManagementApiService } from '../../../core/services/management-api.service';
import { Category, Product } from '../../../core/models/api.models';

interface ProductItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  unitPrice: number;
  stockQty: number;
  reorderPoint: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span>Catalog</span>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span class="current">Products</span>
          </div>
          <h1 class="page-title">Product Catalog</h1>
          <p class="page-subtitle">Manage retail inventory SKUs, categories, unit economics, and price books.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary">
            <span class="material-symbols-outlined">download</span>
            <span>Export CSV</span>
          </button>
          <a routerLink="/products/new" class="btn btn-primary">
            <span class="material-symbols-outlined">add</span>
            <span>Add New Product</span>
          </a>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="filter-card">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Filter by product name, SKU, or category..." 
            [(ngModel)]="searchQuery"
          />
          @if (searchQuery()) {
            <button class="clear-btn" (click)="searchQuery.set('')">
              <span class="material-symbols-outlined">close</span>
            </button>
          }
        </div>

        <div class="filter-selects">
          <select [(ngModel)]="selectedCategory" class="filter-select">
            <option value="ALL">All Categories</option>
            <option value="Consumer Electronics">Consumer Electronics</option>
            <option value="Smartphones & Tablets">Smartphones &amp; Tablets</option>
            <option value="Audio & Accessories">Audio &amp; Accessories</option>
            <option value="Apparel & Footwear">Apparel &amp; Footwear</option>
            <option value="Home & Kitchen">Home &amp; Kitchen</option>
          </select>

          <select [(ngModel)]="selectedStatus" class="filter-select">
            <option value="ALL">All Stock Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Products Data Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product &amp; SKU</th>
              <th>Category</th>
              <th>Cost Price</th>
              <th>Retail Price</th>
              <th>Gross Margin</th>
              <th>Available Stock</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (product of filteredProducts(); track product.id) {
              <tr>
                <td>
                  <div class="product-cell">
                    <span class="product-title">{{ product.name }}</span>
                    <span class="product-sku">{{ product.sku }}</span>
                  </div>
                </td>
                <td>
                  <span class="category-badge">{{ product.category }}</span>
                </td>
                <td>
                  <span class="price-text">&#36;{{ product.costPrice.toFixed(2) }}</span>
                </td>
                <td>
                  <span class="price-text font-bold">&#36;{{ product.unitPrice.toFixed(2) }}</span>
                </td>
                <td>
                  <span class="margin-badge">
                    {{ calculateMargin(product.costPrice, product.unitPrice) }}%
                  </span>
                </td>
                <td>
                  <div class="stock-cell">
                    <span class="stock-num">{{ product.stockQty }} units</span>
                    <span class="reorder-sub">Reorder at {{ product.reorderPoint }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="getStatusBadge(product.status)">
                    <span class="badge-dot"></span>
                    {{ formatStatus(product.status) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <a [routerLink]="['/products/new']" class="btn-icon" title="Edit Product">
                      <span class="material-symbols-outlined">edit</span>
                    </a>
                    <button class="btn-icon delete-icon" title="Delete Product" (click)="deleteProduct(product.id)">
                      <span class="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8" class="empty-state">
                  <span class="material-symbols-outlined empty-icon">search_off</span>
                  <p class="empty-text">No products match your filter criteria.</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .breadcrumb a {
      color: var(--text-secondary);
      text-decoration: none;
    }

    .breadcrumb a:hover { color: var(--primary); }
    .breadcrumb-separator { font-size: 15px; color: var(--text-muted); }
    .breadcrumb .current { color: var(--text-main); font-weight: 500; }

    .page-title {
      font-size: 1.625rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }

    .page-subtitle {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

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

    .search-box {
      position: relative;
      flex: 1;
      min-width: 280px;
      display: flex;
      align-items: center;
    }

    .search-box .material-symbols-outlined {
      position: absolute;
      left: 0.875rem;
      color: var(--text-muted);
      font-size: 18px;
    }

    .search-box input {
      width: 100%;
      height: 38px;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 2.5rem 0 2.5rem;
      color: var(--text-main);
      font-size: 0.85rem;
      font-family: inherit;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .clear-btn {
      position: absolute;
      right: 0.75rem;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .filter-selects {
      display: flex;
      gap: 0.75rem;
    }

    .filter-select {
      height: 38px;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 1rem;
      color: var(--text-main);
      font-size: 0.825rem;
      font-family: inherit;
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--primary);
    }

    .product-cell {
      display: flex;
      flex-direction: column;
    }

    .product-title {
      font-weight: 600;
      color: var(--text-main);
    }

    .product-sku {
      font-size: 0.725rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .category-badge {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .price-text {
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-secondary);
    }

    .price-text.font-bold {
      font-weight: 700;
      color: var(--text-main);
    }

    .margin-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }

    .stock-cell {
      display: flex;
      flex-direction: column;
    }

    .stock-num {
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-main);
    }

    .reorder-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .delete-icon:hover {
      color: var(--accent-rose);
      border-color: var(--accent-rose);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 40px;
      margin-bottom: 0.5rem;
      color: var(--text-muted);
    }
  `]
})
export class ProductListComponent implements OnInit {
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('ALL');
  readonly selectedStatus = signal<string>('ALL');

  readonly products = signal<ProductItem[]>([
    {
      id: 1,
      sku: 'SKU-PHN-PRO15',
      name: 'AeroPro 15 Ultra 256GB - Midnight',
      category: 'Smartphones & Tablets',
      costPrice: 750.00,
      unitPrice: 1099.99,
      stockQty: 73,
      reorderPoint: 30,
      status: 'IN_STOCK'
    },
    {
      id: 2,
      sku: 'SKU-AUD-ANCPRO',
      name: 'SonicWave ANC Wireless Headphones',
      category: 'Audio & Accessories',
      costPrice: 95.00,
      unitPrice: 199.99,
      stockQty: 145,
      reorderPoint: 45,
      status: 'IN_STOCK'
    },
    {
      id: 3,
      sku: 'SKU-AUD-BUDS',
      name: 'PulseAir True Wireless Earbuds',
      category: 'Audio & Accessories',
      costPrice: 32.00,
      unitPrice: 79.99,
      stockQty: 14,
      reorderPoint: 60,
      status: 'LOW_STOCK'
    },
    {
      id: 4,
      sku: 'SKU-APP-JKT01',
      name: 'All-Weather Technical Parka - Navy / L',
      category: 'Apparel & Footwear',
      costPrice: 60.00,
      unitPrice: 149.99,
      stockQty: 42,
      reorderPoint: 20,
      status: 'IN_STOCK'
    },
    {
      id: 5,
      sku: 'SKU-HOM-BLND01',
      name: 'ChefMaster 1200W High-Speed Blender',
      category: 'Home & Kitchen',
      costPrice: 52.00,
      unitPrice: 119.99,
      stockQty: 8,
      reorderPoint: 25,
      status: 'LOW_STOCK'
    },
    {
      id: 6,
      sku: 'SKU-HOM-AIRF02',
      name: 'AeroCrisp 6-Quart Digital Air Fryer',
      category: 'Home & Kitchen',
      costPrice: 44.00,
      unitPrice: 99.99,
      stockQty: 50,
      reorderPoint: 30,
      status: 'IN_STOCK'
    }
  ]);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  private readonly api = inject(ManagementApiService);

  ngOnInit(): void {
    this.load();
    this.api.categories({ size: 200 }).subscribe({ next: page => this.categories.set(page.content) });
  }

  load(): void {
    this.loading.set(true);
    this.api.products(undefined, undefined, { size: 200 }).subscribe({
      next: page => { this.products.set(page.content.map(p => this.toItem(p))); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    this.api.deleteProduct(id).subscribe({ next: () => this.load() });
  }

  private toItem(p: Product): ProductItem {
    const stock = p.totalStock || 0;
    return { id: p.id, sku: p.sku, name: p.name, category: p.categoryName, costPrice: p.costPrice, unitPrice: p.unitPrice, stockQty: stock, reorderPoint: p.reorderPoint, status: stock <= 0 ? 'OUT_OF_STOCK' : stock <= p.reorderPoint ? 'LOW_STOCK' : 'IN_STOCK' };
  }

  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const status = this.selectedStatus();

    return this.products().filter(p => {
      const matchQuery = !query || 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      const matchCat = cat === 'ALL' || p.category === cat;
      const matchStatus = status === 'ALL' || p.status === status;
      return matchQuery && matchCat && matchStatus;
    });
  });

  calculateMargin(cost: number, price: number): string {
    if (!price) return '0.0';
    return (((price - cost) / price) * 100).toFixed(1);
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'IN_STOCK': return 'badge-success';
      case 'LOW_STOCK': return 'badge-danger';
      case 'OUT_OF_STOCK': return 'badge-neutral';
      default: return 'badge-info';
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }
}
