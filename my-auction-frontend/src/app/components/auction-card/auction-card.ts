import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auction } from '../../models/auction.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-auction-card',
  templateUrl: './auction-card.html',
  imports:[DatePipe, CommonModule]
})
export class AuctionCardComponent {
  @Input() auction!: Auction;

  constructor(private router: Router) {}

    get mainImage(): string {
    const firstItem = this.auction?.item;
    if (!firstItem) return '';
    const slike = firstItem.slike;
    return slike && slike.length > 0 ? slike[0] : '';
  }

  getCurrentPrice(): number {
    if (this.auction.bidsList?.length) {
      return Math.max(...this.auction.bidsList.map(b => b.ponuda));
    }
    return this.auction.startingPrice;
  }

  openAuction(): void {
    this.router.navigate(['/auction', this.auction.id]);
  }
}
