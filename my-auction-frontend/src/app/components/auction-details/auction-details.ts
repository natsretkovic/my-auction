import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Auction } from '../../models/auction.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { loadAuctions, selectAuction, placeBid } from '../../store/auction/auction.actions';
import { selectSelectedAuction, selectAuctionLoading } from '../../store/auction/auction.selectors';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./auction-details.css']
})
export class AuctionDetailsComponent implements OnInit {
  auction$!: Observable<Auction | null>;
  loading$!: Observable<boolean>;
  currentUser!: User | null;
  isOwner = false;
  bidAmount: number = 0;
  submittingBid = false;
  currentMainImage?: string;
  bidError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().pipe(
      switchMap(user => {
        this.currentUser = user;
        const auctionId = Number(this.route.snapshot.paramMap.get('id'));

        this.store.dispatch(loadAuctions());
        this.store.dispatch(selectAuction({ auctionId }));

        this.auction$ = this.store.select(selectSelectedAuction).pipe(
          map(auction => {
            if (auction && auction.items.length > 0) {
              this.isOwner = auction.items.some(item => item.vlasnik?.id === this.currentUser?.id);
              const firstItem = auction.items[0];
              if (firstItem?.slike?.length) {
                this.currentMainImage = firstItem.slike[0];
              }
            }
            return auction;
          })
        );

        this.loading$ = this.store.select(selectAuctionLoading);
        return this.auction$;
      })
    ).subscribe();
  }

  selectImage(imageUrl: string): void {
    this.currentMainImage = imageUrl;
  }

  placeBid(auction: Auction): void {
    this.bidError = null;
    const currentPrice = this.getCurrentPrice(auction);

    if (!this.bidAmount || this.bidAmount <= currentPrice) {
      this.bidError = `Ponuda mora biti veća od trenutne cene (${currentPrice})!`;
      return;
    }

    if (!this.currentUser) {
      this.bidError = 'Morate biti ulogovani da biste licitirali.';
      return;
    }

    this.submittingBid = true;

    this.store.dispatch(placeBid({ auctionId: auction.id, bidAmount: this.bidAmount }));

    this.submittingBid = false;
    this.bidAmount = 0;
  }

  getCurrentPrice(auction: Auction): number {
    if (auction?.bidsList?.length) {
      return Math.max(...auction.bidsList.map(b => b.ponuda));
    }
    return auction?.startingPrice || 0;
  }
}
