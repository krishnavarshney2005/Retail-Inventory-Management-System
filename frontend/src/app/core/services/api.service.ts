import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Page, PageRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  protected readonly http = inject(HttpClient); protected readonly baseUrl = environment.apiUrl;
  protected params(values: Record<string, string | number | boolean | undefined | null>): HttpParams { let p = new HttpParams(); Object.entries(values).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '') p = p.set(k, String(v)); }); return p; }
  protected data<T>(request: Observable<ApiResponse<T>>): Observable<T> { return request.pipe(map(r => r.data), catchError(error => throwError(() => error))); }
  list<T>(path: string, query: Record<string, string | number | boolean | undefined | null> = {}, page: PageRequest = {}): Observable<Page<T>> { return this.data(this.http.get<ApiResponse<Page<T>>>(`${this.baseUrl}${path}`, { params: this.params({...query, page: page.page ?? 0, size: page.size ?? 20, sort: page.sort}) })); }
  get<T>(path: string): Observable<T> { return this.data(this.http.get<ApiResponse<T>>(`${this.baseUrl}${path}`)); }
  create<T, R>(path: string, body: R): Observable<T> { return this.data(this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)); }
  update<T, R>(path: string, body: R): Observable<T> { return this.data(this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)); }
  delete(path: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}${path}`); }
}
