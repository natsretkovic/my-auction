import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {

  private actions$: Actions = inject(Actions);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  constructor() {}

 login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ email, password }) => 
        this.authService.login(email, password).pipe(
          map((res: any) => {
            if (res && res.token) { 
                localStorage.setItem('token', res.token); 
            }
            return res; 
          }),
          
          tap((response: any) => {
            if (response?.id) {
              localStorage.setItem('userId', response.id.toString());
            }
          }),
          
          map((user: any) => AuthActions.loginSuccess({ user, redirect: true })),
          
          catchError((error) => {
            this.authService.logout();
            return of(AuthActions.loginFailure({ error: error.error }));
          })
        )
      )
    )
);

  checkAuthStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuthStatus),
      switchMap(() =>
        this.authService.getProfile().pipe(
          tap((response: any) => {
            if (response?.id) {
              localStorage.setItem('userId', response.id.toString());
            }
          }),
          map((user: any) => AuthActions.loginSuccess({ user, redirect: false })),
          
          catchError(() => {
            localStorage.removeItem('token');
            return of(AuthActions.loadUserProfileFailure());
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap((action) => {
        if( action.redirect ) {
          this.router.navigate(['/']);
        }
      }),
    ),
    { dispatch: false } 
  );


  logout$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.logoutRequested),
      tap(() => {
        this.authService.logout(); 
        this.router.navigate(['/login']);
      }),
      map(() => AuthActions.logoutConfirmed())
    )
  );
}