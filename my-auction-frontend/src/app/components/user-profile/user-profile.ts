import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AddAuctionModalComponent } from '../auction-modal/auction-modal';
import { AuthActions } from '../../store/auth/auth.actions';
import { Auction } from '../../models/auction.model';
import { AuctionCardComponent } from '../auction-card/auction-card';
import * as AuctionActions from '../../store/auction/auction.actions';
import * as AuctionSelectors from '../../store/auction/auction.selectors';
import { EditAuctionModal } from '../edit-auction-modal/edit-auction-modal';
import { SiderBar } from '../sider-bar/sider-bar';

@Component({
  selector: 'app-user-profile',
  imports: [MatDialogModule, CommonModule, AuctionCardComponent,SiderBar],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})

export class UserProfileComponent implements OnInit {
  user$!: Observable<any | null>;
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
  handleDeleteAuction(auctionId: number): void {
      if (confirm('Potvrda: Da li ste sigurni da želite obrisati ovu aukciju?')) {
          this.store.dispatch(AuctionActions.deleteAuction({ auctionId: auctionId }));
      }
  }
  openUpdateItemModal(auction: Auction) {
    const dialogRef = this.dialog.open(EditAuctionModal, {
      width: '500px',
    });
    dialogRef.componentInstance.data = auction;

    dialogRef.afterClosed().subscribe((updateData: any) => {
      if (!updateData) return;
      this.store.dispatch(
        AuctionActions.updateAuction({
          auctionId: auction.id,
          data: updateData
        })
      );
    });
  }
}

