import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => { const notifications = inject(NotificationService); return next(req).pipe(catchError((error: HttpErrorResponse) => { const message = error.error?.message || error.error?.data?.message || (error.status === 0 ? 'The server is unavailable.' : 'Request failed. Please try again.'); notifications.error(message); return throwError(() => error); })); };
