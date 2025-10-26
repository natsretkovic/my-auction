import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewState } from './review.reducer';

export const reviewFeatureKey = 'review';

export const selectReviewState = createFeatureSelector<ReviewState>(reviewFeatureKey);

export const selectAllReviews = createSelector(
  selectReviewState,
  (state) => state.reviews
);

export const selectAverageRating = createSelector(
  selectReviewState,
  (state) => state.averageRating
);

export const selectReviewLoading = createSelector(
  selectReviewState,
  (state) => state.loading
);

export const selectReviewError = createSelector(
  selectReviewState,
  (state) => state.error
);