import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Review } from '../../models/review.model';
import { loadReviews, loadAverageRating } from '../../store/review/review.actions';
import { selectAllReviews, selectAverageRating, selectReviewLoading, selectReviewError } from '../../store/review/review.selectors';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-public-profile',
  imports: [CommonModule],
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
}