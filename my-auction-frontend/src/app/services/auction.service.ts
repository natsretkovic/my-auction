import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auction } from '../models/auction.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  private baseUrl = 'http://localhost:3000/auctions';

  constructor(private http: HttpClient) {}

  addAuction(dto: Auction): Observable<any> {
    return this.http.post(`${this.baseUrl}/addAuction`, dto);
  }

 getMyAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.baseUrl}/myAuctions`);
  }
   getAuctionById(auctionId: number): Observable<Auction> {
    return this.http.get<Auction>(`${this.baseUrl}/${auctionId}`);
  }

  placeBid(auctionId: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/bid`, {
      auctionId,
      amount
    });
  }
}
