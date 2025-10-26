import { createAction, props } from '@ngrx/store';
import { Review } from '../../models/review.model';

export const loadReviews = createAction(
  '[Review] Load Reviews',
  props<{ sellerId: number }>()
);
export const loadReviewsSuccess = createAction(
  '[Review] Load Reviews Success',
  props<{ reviews: Review[] }>()
);
export const loadReviewsFailure = createAction(
  '[Review] Load Reviews Failure',
  props<{ error: any }>()
);

export const loadAverageRating = createAction(
  '[Review] Load Average Rating',
  props<{ sellerId: number }>()
);
export const loadAverageRatingSuccess = createAction(
  '[Review] Load Average Rating Success',
  props<{ averageRating: number }>()
);
export const loadAverageRatingFailure = createAction(
  '[Review] Load Average Rating Failure',
  props<{ error: any }>()
);

export const createReview = createAction(
  '[Review] Create Review',
  props<{ sellerId: number; review: Partial<Review> }>()
);
export const createReviewSuccess = createAction(
  '[Review] Create Review Success',
  props<{ review: Review }>()
);
export const createReviewFailure = createAction(
  '[Review] Create Review Failure',
  props<{ error: any }>()
);
