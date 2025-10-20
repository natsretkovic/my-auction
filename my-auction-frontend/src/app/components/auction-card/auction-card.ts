import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auction } from '../../models/auction.model';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-auction-card',
  templateUrl: './auction-card.html',
  imports:[CurrencyPipe, DatePipe, CommonModule]
})
export class AuctionCardComponent {
  @Input() auction!: Auction;

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

    get mainImage(): string {
    const firstItem = this.auction?.items?.[0];
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
