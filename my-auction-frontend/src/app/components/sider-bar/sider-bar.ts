import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: 'app-sider-bar',
  imports: [RouterModule],
  templateUrl: './sider-bar.html',
  styleUrl: './sider-bar.css'
})
export class SiderBar {
  constructor(private store: Store) { }

  logOutUser(): void {
    this.store.dispatch(AuthActions.logout()); 
  }

}
