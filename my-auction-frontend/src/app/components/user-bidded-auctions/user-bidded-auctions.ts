import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AuctionActions from '../../store/auction/auction.actions';
import { selectUserBids } from '../../store/auction/auction.selectors';
import { MyBidDto } from '../../models/dtos/my.bid.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-bidded-auctions',
  templateUrl: './user-bidded-auctions.html',
  styleUrls: ['./user-bidded-auctions.css'],
  imports: [CommonModule]
})
export class UserBiddedAuctions implements OnInit {
  userBids$!: Observable<MyBidDto[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuctionActions.loadUserBids());
    this.userBids$ = this.store.select(selectUserBids);
  }
}
