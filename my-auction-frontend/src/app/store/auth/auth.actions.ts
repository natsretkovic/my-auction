import { createAction, props, emptyProps } from '@ngrx/store';

export const loginRequested = createAction(
  '[Auth] Login Requested',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any; redirect: boolean }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const logoutRequested = createAction(
  '[Auth] Logout Requested',
);

export const logoutConfirmed = createAction(
  '[Auth] Logout Confirmed',
);

export const checkAuthStatus = createAction(
  '[Auth] Check Auth Status',
);

export const loadUserProfile = createAction(
  '[Auth] Load User Profile',
);

export const loadUserProfileSuccess = createAction(
  '[Auth] Load User Profile Success',
  props<{ user: any }>()
);

export const loadUserProfileFailure = createAction(
  '[Auth] Load User Profile Failure',
);

export const AuthActions = {
  loginRequested,
  loginSuccess,
  loginFailure,
  logoutRequested,
  logoutConfirmed,
  checkAuthStatus,
  loadUserProfile,
  loadUserProfileSuccess,
  loadUserProfileFailure,
};