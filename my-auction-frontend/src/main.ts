import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './app/store/auth/auth.effects';
import { AuctionEffects } from './app/store/auction/auction.effects';
import { auctionReducer, auctionFeatureKey } from './app/store/auction/auction.reducer';
import { authFeatureKey, authReducer } from './app/store/auth/auth.reducer';

bootstrapApplication(App, {
  providers: [
   provideStore(),
   provideState({
    name: authFeatureKey,
      reducer: authReducer,

    }),
    provideState({
        name: auctionFeatureKey,
        reducer: auctionReducer,
        }),
    provideEffects([
      AuthEffects,
      AuctionEffects,
    ]),
    
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, 
      multi: true
    },
    
    provideRouter(routes),
  ]
}).catch(err => console.error(err));