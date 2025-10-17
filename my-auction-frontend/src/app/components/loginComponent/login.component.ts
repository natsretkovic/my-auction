// login.component.ts - FINALNO ISPRAVLJENA VERZIJA

import { Component } from '@angular/core';
import { Store } from '@ngrx/store'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import * as AuthActions from '../../store/auth/auth.actions'; 
import * as AuthSelectors from '../../store/auth/auth.selectors';
// Uvezi AppState ako koristiš globalni tip

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';
  
  error$: Observable<any | null>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
    this.isLoading$ = this.store.select(AuthSelectors.selectAuthLoading);
  } 

  login() {
    this.store.dispatch(
        AuthActions.loginRequested({ 
            email: this.email, 
            password: this.password 
        })
    );
  }
}