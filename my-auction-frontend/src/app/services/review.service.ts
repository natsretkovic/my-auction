import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model'

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:3000/reviews';

  constructor(private http: HttpClient) {}

  getReviewsForSeller(sellerId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/seller/${sellerId}`);
  }

  getAverageRatingForSeller(sellerId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/seller/${sellerId}/average`);
  }

  createReview(sellerId: number, review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/seller/${sellerId}`, review);
  }
}