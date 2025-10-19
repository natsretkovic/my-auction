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

 /* getUserAuctions(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }*/
}
