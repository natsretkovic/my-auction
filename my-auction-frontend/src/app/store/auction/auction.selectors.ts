import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuctionState } from './auction.state';
import { auctionFeatureKey } from './auction.reducer';

export const selectAuctionState = createFeatureSelector<AuctionState>(auctionFeatureKey);

export const selectAllAuctions = createSelector(
  selectAuctionState,
  (state) => state.auctions
);

export const selectAuctionLoading = createSelector(
  selectAuctionState,
  (state) => state.loading
);

export const selectAuctionError = createSelector(
  selectAuctionState,
  (state) => state.error
);

export const selectSelectedAuction = createSelector(
  selectAuctionState,
  (state) => state.selectedAuction
);
