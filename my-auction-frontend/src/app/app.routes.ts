import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { AuctionDetailsComponent } from './components/auction-details/auction-details';
import { ShowAuctionsComponent } from './components/show-auctions/show-auctions';
import { UserBiddedAuctions } from './components/user-bidded-auctions/user-bidded-auctions';
import { PublicProfile } from './components/public-profile/public-profile';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserProfileComponent},
  { path: 'auction/:id', component: AuctionDetailsComponent},
  { path: 'show-auctions', component: ShowAuctionsComponent},
  {path: 'my-bids', component: UserBiddedAuctions},
  {path: 'public-profile/:id', component: PublicProfile},
];
