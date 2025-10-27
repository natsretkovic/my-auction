import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { Auction } from '../../models/auction.model';
import { CommonModule } from '@angular/common';
import { AuctionCardComponent } from '../auction-card/auction-card';
import { select, Store } from '@ngrx/store';
import * as AuctionActions from '../../store/auction/auction.actions';
import * as AuctionSelectors from '../../store/auction/auction.selectors';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-show-auctions',
  templateUrl: './show-auctions.html',
  styleUrls: ['./show-auctions.css'],
  imports: [CommonModule,AuctionCardComponent, FormsModule]
})
export class ShowAuctionsComponent implements OnInit {
  popularAuctions$: Observable<Auction[] | null> = new Observable();
  recentAuctions$: Observable<Auction[] | null> = new Observable();
  endingSoonAuctions$: Observable<Auction[] | null> = new Observable();
  initialLoading$: Observable<boolean> = new Observable();
  initialError$: Observable<string | null> = new Observable();

  searchResults$: Observable<Auction[] | null> = new Observable();
  searchLoading$: Observable<boolean> = new Observable();
  searchError$: Observable<string | null> = new Observable();
  searchTerm: string = '';
  
  showInitialLists$: Observable<boolean> = new Observable();
  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.popularAuctions$ = this.store.pipe(select(AuctionSelectors.selectPopularAuctions));
    this.recentAuctions$ = this.store.pipe(select(AuctionSelectors.selectRecentAuctions));
    this.endingSoonAuctions$ = this.store.pipe(select(AuctionSelectors.selectEndingSoonAuctions));
    this.initialLoading$ = this.store.pipe(select(AuctionSelectors.selectInitialLoading));
    this.initialError$ = this.store.pipe(select(AuctionSelectors.selectInitialError));
    
    this.searchResults$ = this.store.pipe(select(AuctionSelectors.selectSearchResults));
    this.searchLoading$ = this.store.pipe(select(AuctionSelectors.selectSearchLoading));
    this.searchError$ = this.store.pipe(select(AuctionSelectors.selectSearchError));
    this.showInitialLists$ = this.store.pipe(select(AuctionSelectors.selectShowInitialLists));
    
    this.store.dispatch(AuctionActions.loadInitialAuctions());
  }

  getCurrentPrice(auction: Auction): number {
    if (auction?.bidsList?.length) {
      return Math.max(...auction.bidsList.map(b => b.ponuda));
    }
    return auction?.startingPrice || 0;
  }

  openAuction(auctionId: number): void {
    this.router.navigate(['/auction', auctionId]);
  }
  onSearchSubmit(): void {
    const input = this.searchTerm.trim();
    if (input !== '') {
      this.store.dispatch(
        AuctionActions.searchAuctions({
           keyword: input
        })
      );
    } else {
      this.store.dispatch(AuctionActions.loadInitialAuctions());
    }
  }
}
