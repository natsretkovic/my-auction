import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, Subscription, timer, combineLatest, interval, takeWhile } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { Auction } from '../../models/auction.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { loadAuctionById, selectAuction, placeBid, joinAuctionRoom } from '../../store/auction/auction.actions';
import { selectSelectedAuction, selectAuctionLoading } from '../../store/auction/auction.selectors';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; 
import customParseFormat from 'dayjs/plugin/customParseFormat'; 

dayjs.extend(utc);
dayjs.extend(customParseFormat);

type CombinedAuctionData = {
    auction: Auction | null;
    remainingTime: string;
    currentPrice: number;
};
@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./auction-details.css']
})
export class AuctionDetailsComponent implements OnInit {
  auction$!: Observable<CombinedAuctionData | null>;
  loading$!: Observable<boolean>;
  remainingTime$!: Observable<string>;
  currentUser!: User | null;
  isOwner = false;
  bidAmount: number = 0;
  submittingBid = false;
  currentMainImage?: string;
  bidError: string | null = null;

  private localBid$ = new Subject<number>();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private authService: AuthService
  ) {}
    ngOnInit(): void {
     this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
    });

  const auctionId = Number(this.route.snapshot.paramMap.get('id'));

    this.store.dispatch(loadAuctionById({ id: auctionId }));
    this.store.dispatch(selectAuction({ auctionId }));
    this.store.dispatch(joinAuctionRoom({ auctionId }));

    const storeAuction$ = this.store.select(selectSelectedAuction);

    this.remainingTime$ = storeAuction$.pipe(
      map(auction => auction?.endDate),
      switchMap(endDateString => {
        if (!endDateString) {
          return new Observable<string>(subscriber =>
           subscriber.complete()).pipe(startWith('...')); 
        }
        
        const auctionEndTime = dayjs(endDateString, 'YYYY-MM-DD HH:mm:ssZ'); 

        return interval(1000).pipe(
          startWith(0),
          map(() => {
            const now = dayjs();
            const diffInMs = auctionEndTime.diff(now);
            
            if (diffInMs <= 0) {
              return '00:00:00'
            };
            
            const totalSeconds = Math.floor(diffInMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            return [hours, minutes, seconds]
              .map(v => v < 10 ? '0' + v : v)
              .join(':');
          }),
          takeWhile(timeString => timeString !== '00:00:00', true),
          startWith('00:00:00') 
        );
      }),
      startWith('Učitavanje...') 
    );


    this.auction$ = combineLatest([
      storeAuction$,
      this.localBid$.pipe(startWith(0)),
      this.remainingTime$
    ]).pipe(
      map(([auction, localBid, remainingTime]) => {
        if (!auction) return null;

        if (auction.item) {
          this.isOwner = auction.item.vlasnik?.id === this.currentUser?.id;
           if (auction.item.slike?.length) {
             this.currentMainImage = auction.item.slike[0];
           }
          }

         const currentPrice = Math.max(
            auction.bidsList?.length ? Math.max(...auction.bidsList.map(b => b.ponuda)) : auction.startingPrice || 0,
            localBid
        );


        return {
            auction: { ...auction },
            remainingTime,
            currentPrice,
            isOwner: auction.item?.vlasnik?.id === this.currentUser?.id || false
        } as CombinedAuctionData;
      })
    );

    this.loading$ = this.store.select(selectAuctionLoading);
  }

  selectImage(imageUrl: string): void {
    this.currentMainImage = imageUrl;
  }

  placeBid(auctionData: CombinedAuctionData): void {
    this.bidError = null;
    const currentPrice = auctionData.currentPrice;

    if (!this.bidAmount || this.bidAmount <= currentPrice) {
      this.bidError = `Ponuda mora biti veća od trenutne cene (${currentPrice})!`;
      return;
    }

    if (!this.currentUser) {
      this.bidError = 'Morate biti ulogovani da biste licitirali.';
      return;
    }

    this.submittingBid = true;

    this.store.dispatch(placeBid({ auctionId: auctionData.auction!.id, bidAmount: this.bidAmount }));
    this.localBid$.next(this.bidAmount);

    this.submittingBid = false;
    this.bidAmount = 0;
  }
}
