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
  state => state.selectedAuction ?? null
);
export const selectBidsForSelectedAuction = createSelector(
  selectSelectedAuction,
  (auction) => auction ? auction.bidsList : []
);

export const selectHighestBid = createSelector(
  selectBidsForSelectedAuction,
  (bids) => bids.length ? Math.max(...bids.map(b => b.ponuda)) : 0
);