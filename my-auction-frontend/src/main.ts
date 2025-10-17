import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './app/store/auth/auth.effects';
import { authFeatureKey, authReducer } from './app/store/auth/auth.reducer';

bootstrapApplication(App, {
  providers: [
    // 1. NgRx Store i Auth State
    provideStore(), // Inicijalizacija glavnog Store-a
    provideState({
      name: authFeatureKey,
      reducer: authReducer,
    }),
    
    // 2. NgRx Effects za Auth
    provideEffects([
      AuthEffects,
    ]),
    
    // 3. HTTP Klijent i Interceptori (Potrebno za AuthService/AuthInterceptor)
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true
    },
    
    // 4. Rutiranje
    provideRouter(routes),
  ]
}).catch(err => console.error(err));