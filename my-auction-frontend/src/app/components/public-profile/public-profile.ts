import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Review } from '../../models/review.model';
import { loadReviews, loadAverageRating, createReview } from '../../store/review/review.actions';
import { selectAllReviews, selectAverageRating, selectReviewLoading, selectReviewError } from '../../store/review/review.selectors';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReviewFormComponent } from '../review-form/review-form';
@Component({
  selector: 'app-public-profile',
  imports: [CommonModule, ReviewFormComponent],
  templateUrl: './public-profile.html',
  styleUrl: './public-profile.css'
})
export class PublicProfile implements OnInit {
  user$!: Observable<User | null>;
  reviews$!: Observable<Review[]>;
  averageRating$!: Observable<number | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  sellerId!: number;
  showReviewForm = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sellerId = Number(this.route.snapshot.paramMap.get('id'));

    this.user$ = this.authService.getProfilById(this.sellerId);

    this.store.dispatch(loadReviews({ sellerId: this.sellerId }));
    this.store.dispatch(loadAverageRating({ sellerId: this.sellerId }));

    this.reviews$ = this.store.select(selectAllReviews);
    this.averageRating$ = this.store.select(selectAverageRating);
    this.loading$ = this.store.select(selectReviewLoading);
    this.error$ = this.store.select(selectReviewError);
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
  }
  onSubmitReview(data: { rating: number; comment: string }) {
  const userId = Number(this.route.snapshot.paramMap.get('id'));

  if (!data.comment.trim()) {
    this.error$ = new Observable(observer => {
      observer.next('Komentar ne može biti prazan.');
      observer.complete();
    });
    return;
  }

  this.store.dispatch(createReview({ 
    sellerId: userId, 
    review: {
      ocena: data.rating,
      komentar: data.comment
    } 
  }));

  this.store.dispatch(loadReviews({ sellerId: userId }));
  this.store.dispatch(loadAverageRating({ sellerId: userId }));

  this.showReviewForm = false;
 }
}