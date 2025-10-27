import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddAuctionModalComponent } from '../auction-modal/auction-modal';
import { AuthActions } from '../../store/auth/auth.actions';
import { Auction } from '../../models/auction.model';
import { AuctionCardComponent } from '../auction-card/auction-card';
import { RouterModule } from '@angular/router';
import * as AuctionActions from '../../store/auction/auction.actions';
import * as AuctionSelectors from '../../store/auction/auction.selectors';

@Component({
  selector: 'app-user-profile',
  imports: [MatDialogModule, CommonModule, AuctionCardComponent,RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})

export class UserProfileComponent implements OnInit {
  user$!: Observable<User | null>;
  userAuctions$!: Observable<Auction[]>;
  userAuctionsLoading$!: Observable<boolean>; 

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.getProfile();
    this.store.dispatch(AuctionActions.loadUserAuctions());
    this.userAuctions$ = this.store.pipe(select(AuctionSelectors.selectUserAuctions));
    this.userAuctionsLoading$ = this.store.pipe(select(AuctionSelectors.selectUserAuctionsLoading));
  }

  openAddAuctionModal() {
    this.dialog.open(AddAuctionModalComponent, {
      width: '500px',
    });
  }

  logOutUser() {
    this.store.dispatch(AuthActions.logout());
  }
}

