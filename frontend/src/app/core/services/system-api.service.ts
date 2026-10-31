import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { SystemStatus } from '../models/system-status.model';

@Injectable({
  providedIn: 'root'
})
export class SystemApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v1/system`;

  // Reactive state signals
  readonly isConnected = signal<boolean>(false);
  readonly isChecking = signal<boolean>(false);
  readonly systemInfo = signal<SystemStatus | null>(null);
  readonly lastError = signal<string | null>(null);

  /**
   * Check connection and retrieve system status from Spring Boot backend
   */
  checkHealth(): Observable<SystemStatus | null> {
    this.isChecking.set(true);
    this.lastError.set(null);

    return this.http.get<ApiResponse<SystemStatus>>(`${this.baseUrl}/status`).pipe(
      map(response => ({
        data: response.data,
        connected: response.success && response.data?.status === 'ONLINE' && response.data.databaseConnected
      })),
      tap(({ data, connected }) => {
        this.isConnected.set(connected);
        this.isChecking.set(false);
        this.systemInfo.set(data);
        this.lastError.set(connected ? null : 'Backend health check reported an offline or unavailable database status.');
      }),
      map(({ data, connected }) => connected ? data : null),
      catchError(err => {
        this.isConnected.set(false);
        this.isChecking.set(false);
        this.lastError.set(err.message || 'Unable to reach backend server');
        return of(null);
      })
    );
  }

  /**
   * Ping backend heartbeat
   */
  ping(): Observable<boolean> {
    return this.http.get<ApiResponse<string>>(`${this.baseUrl}/ping`).pipe(
      map(res => res.success),
      tap(success => this.isConnected.set(success)),
      catchError(() => {
        this.isConnected.set(false);
        return of(false);
      })
    );
  }
}
