import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SystemApiService } from '../../core/services/system-api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar-container">
      <div class="navbar-left">
        <button class="menu-toggle-btn" (click)="toggleSidebar.emit()" title="Toggle Navigation">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <!-- Global Search Bar -->
        <div class="search-wrapper">
          <span class="material-symbols-outlined search-icon">search</span>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search products, SKUs, warehouses, orders..." 
          />
          <kbd class="search-kbd">⌘K</kbd>
        </div>
      </div>

      <div class="navbar-right">
        <!-- Live Spring Boot Connection Indicator -->
        <button class="api-status-pill" (click)="refreshBackendStatus()" [title]="systemApi.isConnected() ? 'Spring Boot API Connected' : 'Click to test Spring Boot connection'">
          <span class="status-dot" [class.online]="systemApi.isConnected()" [class.checking]="systemApi.isChecking()"></span>
          <span class="status-text">
            @if (systemApi.isChecking()) {
              Checking API...
            } @else if (systemApi.isConnected()) {
              Backend Online
            } @else {
              Backend Offline (Click to retry)
            }
          </span>
          <span class="material-symbols-outlined status-sync-icon" [class.spin]="systemApi.isChecking()">sync</span>
        </button>

        <!-- Warehouse Selector Dropdown Pill -->
        <div class="warehouse-pill">
          <span class="material-symbols-outlined">location_on</span>
          <span class="warehouse-name">Chicago Hub (Central)</span>
          <span class="material-symbols-outlined dropdown-icon">expand_more</span>
        </div>

        <!-- Quick Notifications -->
        <button class="icon-button" title="View Alerts and Notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notification-badge">2</span>
        </button>

        <!-- Quick Action Add Button -->
        <a routerLink="/products/new" class="btn btn-primary quick-add-btn">
          <span class="material-symbols-outlined">add</span>
          <span>New Item</span>
        </a>

        <!-- User Profile Pill -->
        <div class="user-profile">
          <div class="avatar-ring">
            <span class="avatar-initials">AD</span>
            <span class="online-indicator"></span>
          </div>
          <div class="user-meta">
            <span class="user-name">Alex Director</span>
            <span class="user-role">Inventory Admin</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-container {
      height: var(--header-height);
      background: var(--bg-header);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex: 1;
      max-width: 550px;
    }

    .menu-toggle-btn {
      display: none;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 1024px) {
      .menu-toggle-btn {
        display: flex;
      }
    }

    .search-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 0.875rem;
      color: var(--text-muted);
      pointer-events: none;
      font-size: 18px;
    }

    .search-input {
      width: 100%;
      height: 40px;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0 3rem 0 2.5rem;
      color: var(--text-main);
      font-size: 0.875rem;
      font-family: inherit;
      transition: all var(--transition-fast);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      background: #1e293b;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-kbd {
      position: absolute;
      right: 0.75rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      padding: 0.15rem 0.4rem;
      font-size: 0.7rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* API Status Pill */
    .api-status-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .api-status-pill:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-main);
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-rose);
      box-shadow: 0 0 6px var(--accent-rose);
    }

    .status-dot.online {
      background: var(--accent-emerald);
      box-shadow: 0 0 8px var(--accent-emerald);
    }

    .status-dot.checking {
      background: var(--accent-amber);
      box-shadow: 0 0 8px var(--accent-amber);
    }

    .status-sync-icon {
      font-size: 15px;
      color: var(--text-muted);
    }

    .status-sync-icon.spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    /* Warehouse selector pill */
    .warehouse-pill {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.775rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .warehouse-pill:hover {
      border-color: rgba(255, 255, 255, 0.2);
      color: var(--text-main);
    }

    .warehouse-name {
      font-weight: 600;
      color: var(--text-main);
    }

    .dropdown-icon {
      font-size: 16px;
      color: var(--text-muted);
    }

    .icon-button {
      position: relative;
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .icon-button:hover {
      color: var(--text-main);
      background: var(--bg-surface-elevated);
    }

    .notification-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: var(--accent-rose);
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--bg-app);
    }

    .quick-add-btn {
      padding: 0.45rem 0.875rem;
      font-size: 0.8rem;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-left: 0.5rem;
      border-left: 1px solid var(--border-subtle);
      cursor: pointer;
    }

    .avatar-ring {
      position: relative;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    }

    .avatar-initials {
      font-size: 0.8rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.05em;
    }

    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent-emerald);
      border: 2px solid var(--bg-app);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    @media (max-width: 850px) {
      .warehouse-pill, .user-meta {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  readonly systemApi = inject(SystemApiService);
  readonly toggleSidebar = output<void>();

  ngOnInit(): void {
    // Probe backend connection on initial load
    this.systemApi.checkHealth().subscribe();
  }

  refreshBackendStatus(): void {
    this.systemApi.checkHealth().subscribe();
  }
}
