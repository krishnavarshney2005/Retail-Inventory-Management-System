import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
  badgeClass?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar-container" [class.collapsed]="isCollapsed()">
      <!-- Brand Logo Header -->
      <div class="sidebar-header">
        <div class="brand-wrapper">
          <div class="logo-mark">
            <span class="material-symbols-outlined logo-icon">inventory_2</span>
          </div>
          @if (!isCollapsed()) {
            <div class="brand-text">
              <span class="brand-title">Retail<span class="brand-highlight">Core</span></span>
              <span class="brand-subtitle">Inventory v1.0</span>
            </div>
          }
        </div>
        <button class="toggle-btn" (click)="toggleCollapse.emit()" [title]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
          <span class="material-symbols-outlined">{{ isCollapsed() ? 'chevron_right' : 'chevron_left' }}</span>
        </button>
      </div>

      <!-- Navigation Links -->
      <div class="nav-content">
        @for (section of navSections; track section.title) {
          <div class="nav-section">
            @if (!isCollapsed()) {
              <div class="section-title">{{ section.title }}</div>
            }
            <nav class="nav-list">
              @for (item of section.items; track item.route) {
                <a [routerLink]="item.route" 
                   routerLinkActive="active" 
                   [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                   class="nav-link"
                   [title]="item.label">
                  <span class="material-symbols-outlined nav-icon">{{ item.icon }}</span>
                  @if (!isCollapsed()) {
                    <span class="nav-label">{{ item.label }}</span>
                    @if (item.badge) {
                      <span class="nav-badge" [ngClass]="item.badgeClass || 'badge-primary'">{{ item.badge }}</span>
                    }
                  }
                </a>
              }
            </nav>
          </div>
        }
      </div>

      <!-- Quick System Status in Sidebar Footer -->
      @if (!isCollapsed()) {
        <div class="sidebar-footer">
          <div class="status-card">
            <div class="status-indicator">
              <span class="status-pulse"></span>
              <span class="status-label">Spring Boot API</span>
            </div>
            <div class="status-sub">Ready for REST calls</div>
          </div>
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar-container {
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      transition: width var(--transition-normal);
      position: sticky;
      top: 0;
      z-index: 50;
      user-select: none;
    }

    .sidebar-container.collapsed {
      width: var(--sidebar-collapsed-width);
    }

    .sidebar-header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand-wrapper {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      overflow: hidden;
    }

    .logo-mark {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: var(--radius-md);
      background: var(--primary-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }

    .logo-icon {
      color: #ffffff;
      font-size: 22px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      white-space: nowrap;
    }

    .brand-title {
      font-size: 1.125rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }

    .brand-highlight {
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-subtitle {
      font-size: 0.675rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .toggle-btn {
      width: 30px;
      height: 30px;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .toggle-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .section-title {
      font-size: 0.675rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 0 0.75rem 0.5rem;
    }

    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.625rem 0.875rem;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition-fast);
      position: relative;
    }

    .nav-link:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-link.active {
      color: #ffffff;
      background: var(--primary-light);
      border-left: 3px solid var(--primary);
      font-weight: 600;
    }

    .nav-link.active .nav-icon {
      color: var(--primary);
    }

    .nav-icon {
      font-size: 20px;
      min-width: 20px;
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-badge {
      font-size: 0.675rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full);
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
    }

    .nav-badge.badge-amber {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-subtle);
    }

    .status-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.75rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .status-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 8px var(--accent-emerald);
      animation: pulse 2s infinite;
    }

    .status-sub {
      font-size: 0.675rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      margin-left: 1.05rem;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
  `]
})
export class SidebarComponent {
  readonly isCollapsed = input<boolean>(false);
  readonly toggleCollapse = output<void>();

  readonly navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' }
      ]
    },
    {
      title: 'Catalog',
      items: [
        { label: 'Product List', route: '/products', icon: 'inventory_2', badge: 'Active' },
        { label: 'Add Product', route: '/products/new', icon: 'add_circle' },
        { label: 'Categories', route: '/categories', icon: 'category' }
      ]
    },
    {
      title: 'Logistics',
      items: [
        { label: 'Warehouses', route: '/warehouses', icon: 'warehouse' },
        { label: 'Inventory Stock', route: '/inventory', icon: 'shelves' },
        { label: 'Suppliers', route: '/suppliers', icon: 'local_shipping' }
      ]
    },
    {
      title: 'Operations & Alerts',
      items: [
        { label: 'Order Management', route: '/orders', icon: 'receipt_long', badge: 'New' },
        { label: 'Reports & Alerts', route: '/reports', icon: 'monitoring', badge: '2 Low', badgeClass: 'badge-amber' }
      ]
    }
  ];
}
