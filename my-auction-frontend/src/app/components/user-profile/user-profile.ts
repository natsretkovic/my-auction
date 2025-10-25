import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddAuctionModalComponent } from '../auction-modal/auction-modal';
import { AuthActions } from '../../store/auth/auth.actions';
import { AuctionService } from '../../services/auction.service';
import { Auction } from '../../models/auction.model';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuctionCardComponent } from '../auction-card/auction-card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [MatDialogModule, CommonModule, AuctionCardComponent,RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})

export class UserProfileComponent implements OnInit {
  user$!: Observable<User | null>;
  auctions: Auction[] = [];
  loadingAuctions = true;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private store: Store,
    private auctionService: AuctionService,
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.getProfile();
    this.loadUserAuctions();
  }

  openAddAuctionModal() {
    this.dialog.open(AddAuctionModalComponent, {
      width: '500px',
    });
  }
  logOutUser(){
    this.store.dispatch(AuthActions.logout());
  }
  loadUserAuctions(): void {
  this.loadingAuctions = true;
  this.auctionService.getMyAuctions().pipe(
    catchError(err => {
      console.error('Greška pri učitavanju aukcija:', err);
      return of([]);
    }),
    finalize(() => this.loadingAuctions = false)
  ).subscribe(data => {
    this.auctions = data;
  });
 }
}

