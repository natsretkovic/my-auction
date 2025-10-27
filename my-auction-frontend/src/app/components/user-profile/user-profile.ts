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
import { UpdateItem } from '../update-item/update-item';
import { ItemCategory } from '../../enums/itemCategory.enum';
import { ItemStatus } from '../../enums/itemStatus.enum';


@Component({
  selector: 'app-user-profile',
  imports: [MatDialogModule, CommonModule, AuctionCardComponent,RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
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
  handleEditAuction(auctionId: number): void {
        //this.router.navigate(['/auction/edit', auctionId]);
  }

  handleDeleteAuction(auctionId: number): void {
      if (confirm('Potvrda: Da li ste sigurni da želite obrisati ovu aukciju?')) {
          this.store.dispatch(AuctionActions.deleteAuction({ auctionId: auctionId }));
      }
  }
  openUpdateItemModal(auction: Auction) {
  const dialogRef = this.dialog.open(UpdateItem, {
    width: '500px',
    data: {
      categories: ItemCategory, 
      statuses: ItemStatus,
      initialData: auction.item
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      this.store.dispatch(
        AuctionActions.updateAuction({
          auctionId: auction.id,
          data: result
        })
      );
    }
  });
 }
}

