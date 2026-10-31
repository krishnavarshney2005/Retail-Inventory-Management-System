import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManagementApiService } from '../../../core/services/management-api.service';
import { Category, ProductRequest } from '../../../core/models/api.models';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-form',
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
            <a routerLink="/products">Products</a>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span class="current">Add Product</span>
          </div>
          <h1 class="page-title">Create Retail Product</h1>
          <p class="page-subtitle">Configure SKU attributes, pricing strategy, safety reorder thresholds, and category mapping.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/products" class="btn btn-secondary">
            Cancel
          </a>
          <button class="btn btn-primary" (click)="saveProduct()">
            <span class="material-symbols-outlined">save</span>
            <span>Save Product</span>
          </button>
        </div>
      </div>

      <!-- Main Form Grid -->
      <div class="form-grid">
        <!-- Form Left Column: Details & Pricing -->
        <div class="form-column">
          <!-- Basic Information Card -->
          <div class="form-card">
            <h2 class="card-title">Product Identity</h2>
            <p class="card-desc">Identifiers, nomenclature, and catalog placement.</p>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label required">Product Name</label>
                <input 
                  type="text" 
                  class="form-input" 
                  placeholder="e.g. AeroPro 15 Ultra 256GB - Midnight" 
                  [(ngModel)]="name"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label required">SKU Code</label>
                <div class="input-with-button">
                  <input 
                    type="text" 
                    class="form-input font-mono" 
                    placeholder="e.g. SKU-PHN-PRO15" 
                    [(ngModel)]="sku"
                  />
                  <button class="btn btn-secondary btn-sm" (click)="generateSku()">Auto-Gen</button>
                </div>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Barcode / UPC</label>
                <input 
                  type="text" 
                  class="form-input font-mono" 
                  placeholder="e.g. 079357319201" 
                  [(ngModel)]="barcode"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label required">Category</label>
                <select class="form-select" [(ngModel)]="categoryId">
                  <option value="1">Consumer Electronics</option>
                  <option value="5">&nbsp;&nbsp;↳ Smartphones &amp; Tablets</option>
                  <option value="6">&nbsp;&nbsp;↳ Audio &amp; Accessories</option>
                  <option value="2">Apparel &amp; Footwear</option>
                  <option value="3">Home &amp; Kitchen</option>
                  <option value="4">Health &amp; Personal Care</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Unit of Measure</label>
                <select class="form-select" [(ngModel)]="unitOfMeasure">
                  <option value="UNIT">Unit (Each)</option>
                  <option value="BOX">Box / Pack</option>
                  <option value="KG">Kilogram (kg)</option>
                  <option value="METER">Meter (m)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description &amp; Specifications</label>
              <textarea 
                class="form-textarea" 
                rows="4" 
                placeholder="Detailed commercial description, packaging specs, and warranty details..."
                [(ngModel)]="description"
              ></textarea>
            </div>
          </div>

          <!-- Unit Economics & Pricing Card -->
          <div class="form-card">
            <h2 class="card-title">Pricing &amp; Margins</h2>
            <p class="card-desc">Cost of goods sold (COGS) and suggested retail price (MSRP).</p>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label required">Cost Price ($)</label>
                <input 
                  type="number" 
                  class="form-input font-mono" 
                  placeholder="0.00" 
                  [(ngModel)]="costPrice" 
                  step="0.01"
                />
              </div>

              <div class="form-group flex-1">
                <label class="form-label required">Retail Selling Price ($)</label>
                <input 
                  type="number" 
                  class="form-input font-mono" 
                  placeholder="0.00" 
                  [(ngModel)]="unitPrice" 
                  step="0.01"
                />
              </div>
            </div>

            <!-- Auto-Calculated Unit Profit & Margin Pill -->
            <div class="margin-preview-box">
              <div class="margin-item">
                <span class="margin-label">Gross Profit per Unit</span>
                <span class="margin-val">&#36;{{ getProfit().toFixed(2) }}</span>
              </div>
              <div class="margin-divider"></div>
              <div class="margin-item">
                <span class="margin-label">Profit Margin</span>
                <span class="margin-val highlight">{{ getMargin() }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Right Column: Inventory Thresholds & Status -->
        <div class="form-column">
          <div class="form-card">
            <h2 class="card-title">Inventory Bounds</h2>
            <p class="card-desc">Automated alerts and warehouse reordering parameters.</p>

            <div class="form-group">
              <label class="form-label required">Reorder Point</label>
              <input 
                type="number" 
                class="form-input font-mono" 
                placeholder="25" 
                [(ngModel)]="reorderPoint"
              />
              <span class="input-hint">Generates automatic low-stock alert when quantity drops below this level.</span>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label required">Min Stock</label>
                <input 
                  type="number" 
                  class="form-input font-mono" 
                  placeholder="10" 
                  [(ngModel)]="minStock"
                />
              </div>

              <div class="form-group flex-1">
                <label class="form-label required">Max Stock</label>
                <input 
                  type="number" 
                  class="form-input font-mono" 
                  placeholder="500" 
                  [(ngModel)]="maxStock"
                />
              </div>
            </div>
          </div>

          <div class="form-card">
            <h2 class="card-title">Catalog Visibility</h2>
            <p class="card-desc">Control product status in orders and POS.</p>

            <label class="toggle-control">
              <input type="checkbox" [(ngModel)]="isActive" />
              <span class="toggle-slider"></span>
              <span class="toggle-label">Active for Ordering &amp; Sales</span>
            </label>
          </div>
        </div>
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

    .form-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 1024px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .card-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: -0.75rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .form-row {
        flex-direction: column;
      }
    }

    .flex-1 { flex: 1; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .form-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .form-label.required::after {
      content: ' *';
      color: var(--accent-rose);
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.65rem 0.875rem;
      color: var(--text-main);
      font-size: 0.875rem;
      font-family: inherit;
      transition: all var(--transition-fast);
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    .input-with-button {
      display: flex;
      gap: 0.5rem;
    }

    .input-hint {
      font-size: 0.725rem;
      color: var(--text-muted);
    }

    /* Margin Preview Box */
    .margin-preview-box {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .margin-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .margin-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .margin-val {
      font-size: 1.25rem;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-main);
    }

    .margin-val.highlight {
      color: #34d399;
    }

    .margin-divider {
      width: 1px;
      height: 35px;
      background: var(--border-subtle);
    }

    /* Toggle Control */
    .toggle-control {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
    }

    .toggle-control input {
      display: none;
    }

    .toggle-slider {
      width: 44px;
      height: 24px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      position: relative;
      transition: background-color var(--transition-fast);
    }

    .toggle-slider::after {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      top: 2px;
      left: 2px;
      transition: transform var(--transition-fast);
    }

    .toggle-control input:checked + .toggle-slider {
      background: var(--primary);
    }

    .toggle-control input:checked + .toggle-slider::after {
      transform: translateX(20px);
    }

    .toggle-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
    }
  `]
})
export class ProductFormComponent implements OnInit {
  name = '';
  sku = '';
  barcode = '';
  categoryId = '1';
  unitOfMeasure = 'UNIT';
  description = '';
  costPrice: number = 0;
  unitPrice: number = 0;
  reorderPoint: number = 25;
  minStock: number = 10;
  maxStock: number = 500;
  isActive: boolean = true;

  private readonly api = inject(ManagementApiService);
  private readonly notifications = inject(NotificationService);
  readonly categories = signal<Category[]>([]);
  readonly saving = signal(false);
  constructor(private router: Router) {}
  ngOnInit(): void { this.api.categories({ size: 200 }).subscribe({ next: page => this.categories.set(page.content) }); }

  generateSku(): void {
    const prefix = 'SKU-RET';
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.sku = `${prefix}-${rand}`;
  }

  getProfit(): number {
    return Math.max(0, (this.unitPrice || 0) - (this.costPrice || 0));
  }

  getMargin(): string {
    if (!this.unitPrice || this.unitPrice <= 0) return '0.0';
    const margin = ((this.unitPrice - this.costPrice) / this.unitPrice) * 100;
    return margin.toFixed(1);
  }

  saveProduct(): void {
    if (!this.name.trim() || !this.sku.trim() || !this.categoryId) { this.notifications.error('Name, SKU, and category are required.'); return; }
    const request: ProductRequest = { name: this.name.trim(), sku: this.sku.trim(), barcode: this.barcode || undefined, categoryId: Number(this.categoryId), description: this.description || undefined, costPrice: this.costPrice, unitPrice: this.unitPrice, reorderPoint: this.reorderPoint, minStockLevel: this.minStock, maxStockLevel: this.maxStock, unitOfMeasure: this.unitOfMeasure, isActive: this.isActive };
    this.saving.set(true); this.api.createProduct(request).subscribe({ next: () => { this.notifications.success('Product saved successfully.'); this.router.navigate(['/products']); }, error: () => this.saving.set(false) });
  }
}
