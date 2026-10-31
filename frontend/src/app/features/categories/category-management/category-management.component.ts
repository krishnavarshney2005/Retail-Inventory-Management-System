import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManagementApiService } from '../../../core/services/management-api.service';
import { Category } from '../../../core/models/api.models';
import { NotificationService } from '../../../core/services/notification.service';

interface CategoryItem {
  id: number;
  name: string;
  code: string;
  parentName?: string;
  productCount: number;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <div class="breadcrumb">
            <a routerLink="/dashboard">Dashboard</a>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span>Catalog</span>
            <span class="material-symbols-outlined breadcrumb-separator">chevron_right</span>
            <span class="current">Categories</span>
          </div>
          <h1 class="page-title">Category Management</h1>
          <p class="page-subtitle">Organize products into hierarchical departments and sub-categories.</p>
        </div>
        <button class="btn btn-primary" (click)="showAddForm.set(!showAddForm())">
          <span class="material-symbols-outlined">add</span>
          <span>{{ showAddForm() ? 'Close Form' : 'New Category' }}</span>
        </button>
      </div>

      <!-- Quick Add Category Panel -->
      @if (showAddForm()) {
        <div class="card add-form-card">
          <h2 class="card-title">Add New Category</h2>
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Category Name</label>
              <input type="text" class="form-input" placeholder="e.g. Gaming &amp; Consoles" [(ngModel)]="newCatName" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Category Code</label>
              <input type="text" class="form-input font-mono" placeholder="e.g. CAT-GAME" [(ngModel)]="newCatCode" />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Parent Category</label>
              <select class="form-select" [(ngModel)]="newCatParent">
                <option value="">None (Top Level)</option>
                <option value="Consumer Electronics">Consumer Electronics</option>
                <option value="Apparel & Footwear">Apparel &amp; Footwear</option>
                <option value="Home & Kitchen">Home &amp; Kitchen</option>
              </select>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" (click)="showAddForm.set(false)">Cancel</button>
            <button class="btn btn-primary" (click)="addCategory()">Save Category</button>
          </div>
        </div>
      }

      <!-- Categories Data Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Category Code</th>
              <th>Category Name</th>
              <th>Parent Level</th>
              <th>Products Linked</th>
              <th>Description</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (cat of categories(); track cat.id) {
              <tr>
                <td>
                  <span class="font-mono text-cyan">{{ cat.code }}</span>
                </td>
                <td>
                  <div class="category-name-cell">
                    <span class="cat-name">{{ cat.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="parent-tag">{{ cat.parentName || '— Root —' }}</span>
                </td>
                <td>
                  <span class="count-pill">{{ cat.productCount }} items</span>
                </td>
                <td>
                  <span class="desc-text">{{ cat.description }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="cat.isActive ? 'badge-success' : 'badge-neutral'">
                    <span class="badge-dot"></span>
                    {{ cat.isActive ? 'ACTIVE' : 'INACTIVE' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" title="Edit Category">
                      <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon delete-icon" title="Delete Category">
                      <span class="material-symbols-outlined">delete</span>
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

    .add-form-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }

    .card-title { font-size: 1.1rem; font-weight: 700; color: var(--text-main); }
    .form-row { display: flex; gap: 1rem; }
    @media (max-width: 768px) { .form-row { flex-direction: column; } }
    .flex-1 { flex: 1; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); }
    .form-input, .form-select {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.65rem 0.875rem;
      color: var(--text-main);
      font-size: 0.875rem;
      font-family: inherit;
    }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }

    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .text-cyan { color: #38bdf8; font-weight: 600; font-size: 0.8rem; }
    .cat-name { font-weight: 600; color: var(--text-main); }
    .parent-tag { font-size: 0.75rem; color: var(--text-muted); }
    .count-pill {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }
    .desc-text { font-size: 0.8rem; color: var(--text-secondary); }
    .action-buttons { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; }
    .delete-icon:hover { color: var(--accent-rose); border-color: var(--accent-rose); }
  `]
})
export class CategoryManagementComponent implements OnInit {
  readonly showAddForm = signal<boolean>(false);
  newCatName = '';
  newCatCode = '';
  newCatParent = '';

  readonly categories = signal<CategoryItem[]>([
    {
      id: 1,
      name: 'Consumer Electronics',
      code: 'CAT-ELEC',
      productCount: 420,
      description: 'Smartphones, laptops, accessories, and gadgets',
      isActive: true
    },
    {
      id: 5,
      name: 'Smartphones & Tablets',
      code: 'CAT-ELEC-PHN',
      parentName: 'Consumer Electronics',
      productCount: 180,
      description: 'Flagship mobile devices, tablets, and e-readers',
      isActive: true
    },
    {
      id: 6,
      name: 'Audio & Accessories',
      code: 'CAT-ELEC-AUD',
      parentName: 'Consumer Electronics',
      productCount: 240,
      description: 'Headphones, earbuds, charging stations, cables',
      isActive: true
    },
    {
      id: 2,
      name: 'Apparel & Footwear',
      code: 'CAT-APPR',
      productCount: 650,
      description: 'Men, women, and kids apparel, athletic wear, and footwear',
      isActive: true
    },
    {
      id: 3,
      name: 'Home & Kitchen',
      code: 'CAT-HOME',
      productCount: 310,
      description: 'Appliances, cookware, storage, and home decor',
      isActive: true
    },
    {
      id: 4,
      name: 'Health & Personal Care',
      code: 'CAT-HLTH',
      productCount: 100,
      description: 'Wellness products, personal grooming, and essentials',
      isActive: true
    }
  ]);

  private readonly api = inject(ManagementApiService);
  private readonly notifications = inject(NotificationService);
  ngOnInit(): void { this.load(); }
  load(): void { this.api.categories({ size: 200 }).subscribe({ next: page => this.categories.set(page.content.map(c => ({ id:c.id, name:c.name, code:c.code, parentName:c.parentName, productCount:c.productCount, description:c.description || '', isActive:c.isActive }))) }); }
  addCategory(): void {
    if (!this.newCatName.trim() || !this.newCatCode.trim()) { this.notifications.error('Category name and code are required.'); return; }
    const parent = this.categories().find(c => c.name === this.newCatParent);
    this.api.createCategory({ name:this.newCatName.trim(), code:this.newCatCode.trim(), parentId:parent?.id, description:'', isActive:true }).subscribe({ next: () => { this.notifications.success('Category saved successfully.'); this.newCatName=''; this.newCatCode=''; this.newCatParent=''; this.showAddForm.set(false); this.load(); } });
  }
}
