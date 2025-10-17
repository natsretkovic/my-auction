import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: any | null; 
  isLoading: boolean; 
  error: any | null; 
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  isAuthLoaded: false,
};

export const authFeatureKey = 'auth';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.loginRequested, (state) => ({ 
    ...state, 
    isLoading: true, 
    error: null 
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user: user,
    isLoading: false,
    isAuthenticated: true,
    isAuthLoaded: true,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: error,
  })),

  on(AuthActions.logoutRequested, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.logoutConfirmed, (state) => ({
    ...state,
    user: null,
    isLoading: false,
    isAuthenticated: false,
    isAuthLoaded: true,
    error: null,
  })),

  on(AuthActions.checkAuthStatus, (state) => ({
    ...state,
    isLoading: true,
    isAuthLoaded: false,
    error: null,
  })),

  on(AuthActions.loadUserProfile, (state) => ({
    ...state,
    isLoading: true,
  })),
  
  on(AuthActions.loadUserProfileSuccess, (state, { user }) => ({
    ...state,
    user: user,
    isLoading: false,
    isAuthenticated: true,
    isAuthLoaded: true,
    error: null,
  })),

  on(AuthActions.loadUserProfileFailure, (state) => ({
    ...state,
    isLoading: false,
    isAuthenticated: false,
    isAuthLoaded: true,
    error: null,
  })),  
);