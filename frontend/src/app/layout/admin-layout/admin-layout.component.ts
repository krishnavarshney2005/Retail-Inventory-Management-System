import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="admin-wrapper">
      <app-sidebar 
        [isCollapsed]="isSidebarCollapsed()"
        (toggleCollapse)="toggleSidebar()"
      />

      <div class="main-content-column">
        <app-navbar (toggleSidebar)="toggleSidebar()" />
        
        <main class="page-body">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-app);
      position: relative;
    }

    .main-content-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.04), transparent 50%),
                  radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.03), transparent 40%);
    }

    .page-body {
      flex: 1;
      padding: 1.75rem 2rem 3rem;
      max-width: 1600px;
      width: 100%;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .page-body {
        padding: 1.25rem 1rem 2rem;
      }
    }
  `]
})
export class AdminLayoutComponent {
  readonly isSidebarCollapsed = signal<boolean>(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(val => !val);
  }
}
