import { Injectable, signal } from '@angular/core';
export interface Notification { type: 'success' | 'error'; message: string; }
@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly current = signal<Notification | null>(null);
  success(message: string) { this.show('success', message); }
  error(message: string) { this.show('error', message); }
  private show(type: Notification['type'], message: string) { this.current.set({ type, message }); setTimeout(() => this.current.set(null), 4500); }
}
