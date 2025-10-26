import { createFeatureSelector, createSelector } from '@ngrx/store';
import { auctionAdapter, AuctionEntityState } from './auction.state';
import { auctionFeatureKey } from './auction.reducer';

export const selectAuctionState = createFeatureSelector<AuctionEntityState>(auctionFeatureKey);

export const {
  selectAll: selectAllAuctions,
  selectEntities: selectAuctionEntities,
} = auctionAdapter.getSelectors(selectAuctionState);

export const selectSelectedAuction = createSelector(
  selectAuctionState,
  (state) => state.selectedAuctionId ? state.entities[state.selectedAuctionId] : null
);

export const selectBidsForSelectedAuction = createSelector(
  selectSelectedAuction,
  (auction) => auction ? auction.bidsList : []
);

export const selectHighestBid = createSelector(
  selectBidsForSelectedAuction,
  (bids) => bids.length ? Math.max(...bids.map(b => b.ponuda)) : 0
);

export const selectAuctionLoading = createSelector(
  selectAuctionState,
  (state) => state.loading
);

export const selectAuctionError = createSelector(
  selectAuctionState,
  (state) => state.error
);

export const selectUserBids = createSelector(
  selectAuctionState,
  (state) => state.userBids
);