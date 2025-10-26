import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ReviewActions from './review.actions';
import { ReviewService } from '../../services/review.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ReviewEffects {
  private actions$ = inject(Actions);
  private reviewService = inject(ReviewService);

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.loadReviews),
      mergeMap(({ sellerId }) =>
        this.reviewService.getReviewsForSeller(sellerId).pipe(
          map(reviews => ReviewActions.loadReviewsSuccess({ reviews })),
          catchError(error => of(ReviewActions.loadReviewsFailure({ error: error.message })))
        )
      )
    )
  );

  loadAverageRating$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.loadAverageRating),
      mergeMap(({ sellerId }) =>
        this.reviewService.getAverageRatingForSeller(sellerId).pipe(
          map(avg => ReviewActions.loadAverageRatingSuccess({ averageRating: avg })),
          catchError(error => of(ReviewActions.loadAverageRatingFailure({ error: error.message })))
        )
      )
    )
  );
  createReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.createReview),
      mergeMap(({ sellerId, review }) =>
        this.reviewService.createReview(sellerId, review).pipe(
          map((createdReview) =>
            ReviewActions.createReviewSuccess({ review: createdReview })
          ),
          catchError((error) =>
            of(ReviewActions.createReviewFailure({ error }))
          )
        )
      )
    )
  );
}
