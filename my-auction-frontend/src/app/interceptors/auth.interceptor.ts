import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable() 
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const unprotectedRoutes = ['/auth/login', '/auth/register'];
    const isUnprotected = unprotectedRoutes.some(route => request.url.endsWith(route));

    if (isUnprotected) { 
      return next.handle(request);
    }
    
    const token = localStorage.getItem('token'); 
    
    let clonedRequest = request;
    if (token) {
        clonedRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}` 
            }
        });
    }

    return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                console.warn('Sesija Vam je istekla. Molimo prijavite se ponovo.');
                this.authService.logout();
                this.router.navigate(['/login']);
                return throwError(() => error);
            }
        return throwError(() => error);
        })
    );
  }
}