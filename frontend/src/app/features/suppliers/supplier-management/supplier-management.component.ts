import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagementApiService } from '../../../core/services/management-api.service';

interface SupplierItem {
  id: number;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  cityState: string;
  activeOrders: number;
  isActive: boolean;
}

@Component({
  selector: 'app-supplier-management',
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
            <span class="current">Suppliers</span>
          </div>
          <h1 class="page-title">Supplier Management</h1>
          <p class="page-subtitle">Vendor directory, procurement contracts, purchase order routing, and partner performance.</p>
        </div>
        <button class="btn btn-primary">
          <span class="material-symbols-outlined">person_add</span>
          <span>Add Supplier</span>
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Supplier Code</th>
              <th>Company Name</th>
              <th>Key Contact</th>
              <th>Contact Details</th>
              <th>Location</th>
              <th>Open POs</th>
              <th>Status</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            @for (sup of suppliers(); track sup.id) {
              <tr>
                <td>
                  <span class="font-mono text-cyan">{{ sup.code }}</span>
                </td>
                <td>
                  <span class="sup-company">{{ sup.name }}</span>
                </td>
                <td>
                  <span class="contact-person">{{ sup.contactPerson }}</span>
                </td>
                <td>
                  <div class="contact-col">
                    <span class="contact-email">{{ sup.email }}</span>
                    <span class="contact-phone">{{ sup.phone }}</span>
                  </div>
                </td>
                <td>
                  <span class="location-text">{{ sup.cityState }}</span>
                </td>
                <td>
                  <span class="orders-pill">{{ sup.activeOrders }} orders</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="sup.isActive ? 'badge-success' : 'badge-neutral'">
                    <span class="badge-dot"></span>
                    {{ sup.isActive ? 'ACTIVE' : 'INACTIVE' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" title="Create Purchase Order">
                      <span class="material-symbols-outlined">add_shopping_cart</span>
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

    .font-mono { font-family: 'JetBrains Mono', monospace; }
    .text-cyan { color: #38bdf8; font-weight: 600; font-size: 0.8rem; }
    .sup-company { font-weight: 600; color: var(--text-main); }
    .contact-person { color: var(--text-main); font-size: 0.85rem; }
    .contact-col { display: flex; flex-direction: column; gap: 0.15rem; }
    .contact-email { font-size: 0.775rem; color: var(--primary); }
    .contact-phone { font-size: 0.725rem; color: var(--text-muted); }
    .location-text { font-size: 0.8rem; color: var(--text-secondary); }
    .orders-pill {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }
    .action-buttons { display: flex; align-items: center; justify-content: flex-end; }
  `]
})
export class SupplierManagementComponent implements OnInit {
  readonly suppliers = signal<SupplierItem[]>([
    {
      id: 1,
      code: 'SUP-APEX-01',
      name: 'Apex Electronics Global Ltd',
      contactPerson: 'Elena Rostova',
      email: 'contact@apexelectronics.com',
      phone: '+1-415-555-0199',
      cityState: 'San Jose, CA',
      activeOrders: 2,
      isActive: true
    },
    {
      id: 2,
      code: 'SUP-VANG-02',
      name: 'Vanguard Textile & Garments',
      contactPerson: 'Marcus Chen',
      email: 'orders@vanguardtextile.com',
      phone: '+1-212-555-0144',
      cityState: 'New York, NY',
      activeOrders: 1,
      isActive: true
    },
    {
      id: 3,
      code: 'SUP-MODL-03',
      name: 'Modern Living Supplies Inc',
      contactPerson: 'Sarah Jenkins',
      email: 'supply@modernliving.com',
      phone: '+1-312-555-0177',
      cityState: 'Chicago, IL',
      activeOrders: 3,
      isActive: true
    }
  ]);
  private readonly api = inject(ManagementApiService);
  ngOnInit(): void { this.api.suppliers(undefined, { size: 200 }).subscribe({ next: page => this.suppliers.set(page.content.map(s => ({ id:s.id, code:s.supplierCode, name:s.companyName, contactPerson:s.contactPerson || '', email:s.email, phone:s.phone || '', cityState:[s.city,s.state].filter(Boolean).join(', '), activeOrders:0, isActive:s.isActive }))) }); }
}
