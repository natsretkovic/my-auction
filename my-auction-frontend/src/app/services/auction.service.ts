import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auction } from '../models/auction.model';
import { User } from '../models/user.model';
import { UpdateAuctionDto, UpdateItemDto } from '../models/dtos/update.dto';
import { MyBidDto } from '../models/dtos/my.bid.dto';


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
  getPopularAuctions(): Observable<Auction[]> {
  return this.http.get<Auction[]>(`${this.baseUrl}/popular`);
 }

  getRecentAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.baseUrl}/recent`);
  }

  getEndingSoonAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(`${this.baseUrl}/endingSoon`);
  }

  updateAuction(auctionId: number, data: UpdateAuctionDto): Observable<Auction> {
    return this.http.patch<Auction>(`${this.baseUrl}/${auctionId}`, data);
  }
  deleteAuction(auctionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${auctionId}`);
  }
  expireAuction(id: number): Observable<void> {
  return this.http.put<void>(`/api/auctions/${id}/expire`, {});
  }
  getMyBids(): Observable<MyBidDto[]> {
    return this.http.get<MyBidDto[]>(`${this.baseUrl}/my-bids`);
  }
  searchAuctions( keyword: string ): Observable<Auction[]> {
  return this.http.get<Auction[]>(`${this.baseUrl}/search`, {
    params: { keyword }
  });
 }
}
