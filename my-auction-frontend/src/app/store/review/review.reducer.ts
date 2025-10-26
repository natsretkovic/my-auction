import { createReducer, on } from '@ngrx/store';
import * as ReviewActions from './review.actions';
import { Review } from '../../models/review.model';

export interface ReviewState {
  reviews: Review[];
  averageRating: number | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ReviewState = {
  reviews: [],
  averageRating: null,
  loading: false,
  error: null
};

export const reviewReducer = createReducer(
  initialState,

  on(ReviewActions.loadReviews, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ReviewActions.loadReviewsSuccess, (state, { reviews }) => ({
    ...state,
    loading: false,
    reviews
  })),
  on(ReviewActions.loadReviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ReviewActions.loadAverageRating, (state) => ({
    
    ...state,
    loading: true,
    error: null
  })),
  on(ReviewActions.loadAverageRatingSuccess, (state, { averageRating }) => ({
    ...state,
    loading: false,
    averageRating
  })),
  on(ReviewActions.loadAverageRatingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
