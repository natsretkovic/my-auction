import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Auction } from '../../models/auction.model';
import { CommonModule, DatePipe } from '@angular/common';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-auction-card',
  templateUrl: './auction-card.html',
  imports:[DatePipe, CommonModule]
})
export class AuctionCardComponent {
  @Input() auction!: Auction;
  @Input() currentUser!: any | null;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

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
  isOwner(): boolean {
    return this.currentUser?.id === this.auction?.item?.vlasnik?.id;
    
  }
  onEditClick(): void {
    this.edit.emit(this.auction.id);
  }
 
  onDeleteClick(): void {
    this.delete.emit(this.auction.id);
  }
}
