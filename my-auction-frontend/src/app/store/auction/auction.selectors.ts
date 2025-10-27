import { createFeatureSelector, createSelector } from '@ngrx/store';
import { auctionAdapter, AuctionEntityState } from './auction.state';
import { auctionFeatureKey } from './auction.reducer';
import { Auction } from '../../models/auction.model';

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

const mapIdsToAuctions = (ids: number[] | null, entities: Record<string, Auction | undefined>): Auction[] | null => {
    if (ids === null) return null;
    
    return ids
        .map(id => entities[String(id)]) 
        .filter((a): a is Auction => !!a); 
};

export const selectInitialLoading = createSelector(selectAuctionState, (state) => state.initialLoading);
export const selectInitialError = createSelector(selectAuctionState, (state) => state.initialError);

export const selectPopularAuctions = createSelector(
  selectAuctionState,
  selectAuctionEntities,
  (state, entities) => mapIdsToAuctions(state.popularAuctionIds, entities)
);

export const selectRecentAuctions = createSelector(
  selectAuctionState,
  selectAuctionEntities,
  (state, entities) => mapIdsToAuctions(state.recentAuctionIds, entities)
);

export const selectEndingSoonAuctions = createSelector(
  selectAuctionState,
  selectAuctionEntities,
  (state, entities) => mapIdsToAuctions(state.endingSoonAuctionIds, entities)
);

export const selectSearchLoading = createSelector(selectAuctionState, (state) => state.searchLoading);
export const selectSearchError = createSelector(selectAuctionState, (state) => state.searchError);

export const selectSearchResults = createSelector(
  selectAuctionState,
  selectAuctionEntities,
  (state, entities) => mapIdsToAuctions(state.searchAuctionIds, entities)
);

export const selectShowInitialLists = createSelector(selectAuctionState, (state) => state.searchAuctionIds === null);
export const selectUserAuctions = createSelector(
    selectAuctionState,
    selectAuctionEntities,
    (state, entities) => {
        if (!state.userAuctionIds) {
            return [];
        }
        return state.userAuctionIds
            .map(id => entities[id])
            .filter((auction): auction is Auction => !!auction);
    }
);

export const selectUserAuctionsLoading = createSelector(
    selectAuctionState,
    (state) => state.userAuctionsLoading
);