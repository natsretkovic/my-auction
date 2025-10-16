import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcomeComponent/welcome.component';
import { LoginComponent } from './loginComponent/login.component';
import { RegisterComponent } from './registerComponent/register.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
