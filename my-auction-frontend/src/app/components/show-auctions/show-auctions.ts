import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { Auction } from '../../models/auction.model';
import { CommonModule } from '@angular/common';
import { AuctionCardComponent } from '../auction-card/auction-card';



@Component({
  selector: 'app-show-auctions',
  templateUrl: './show-auctions.html',
  styleUrls: ['./show-auctions.css'],
  imports: [CommonModule,AuctionCardComponent]
})
export class ShowAuctionsComponent implements OnInit {
  popularAuctions: Auction[] = [];
  recentAuctions: Auction[] = [];
  endingSoonAuctions: Auction[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private auctionService: AuctionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      popular: this.auctionService.getPopularAuctions(),
      recent: this.auctionService.getRecentAuctions(),
      endingSoon: this.auctionService.getEndingSoonAuctions()
    }).subscribe({
      next: (result) => {
        this.popularAuctions = result.popular;
        this.recentAuctions = result.recent;
        this.endingSoonAuctions = result.endingSoon;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Greška pri učitavanju aukcija.';
        this.loading = false;
      }
    });
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
}
