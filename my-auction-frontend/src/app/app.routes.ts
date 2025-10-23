import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcomeComponent/welcome.component';
import { LoginComponent } from './components/loginComponent/login.component';
import { RegisterComponent } from './components/registerComponent/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { AuctionDetailsComponent } from './components/auction-details/auction-details';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserProfileComponent},
  { path: 'auction/:id', component: AuctionDetailsComponent},
];
