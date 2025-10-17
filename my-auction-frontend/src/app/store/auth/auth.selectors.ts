import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, authFeatureKey } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(
  authFeatureKey
);

export const selectIsAuthenticated = createSelector( 
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => !!state.user 
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsAuthLoaded = createSelector(
  selectAuthState,
  (state) => state.isAuthLoaded
);