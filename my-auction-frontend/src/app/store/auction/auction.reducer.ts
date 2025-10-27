import { createReducer, on } from '@ngrx/store';
import * as AuctionActions from './auction.actions';
import { initialState, auctionAdapter } from './auction.state';

export const auctionFeatureKey = 'auction';

export const auctionReducer = createReducer(
  initialState,

  on(AuctionActions.loadAuctions, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuctionActions.loadAuctionsSuccess, (state, { auctions }) =>
    auctionAdapter.setAll(auctions, { ...state, loading: false, error: null })
  ),
  on(AuctionActions.loadAuctionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuctionActions.addAuction, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuctionActions.addAuctionSuccess, (state, { auction }) =>
    auctionAdapter.addOne(auction, { ...state, loading: false, error: null })
  ),
  on(AuctionActions.addAuctionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuctionActions.selectAuction, (state, { auctionId }) => ({
    ...state,
    selectedAuctionId: auctionId,
  })),

  on(AuctionActions.placeBidSuccess, (state, { bid }) => {
    const selectedId = state.selectedAuctionId;
    if (!selectedId) return state;

    const selectedAuction = state.entities[selectedId];
    if (!selectedAuction) return state;

    return auctionAdapter.updateOne(
      {
        id: selectedId,
        changes: { bidsList: [...selectedAuction.bidsList, bid] },
      },
      state
    );
  }),
  on(AuctionActions.placeBidFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AuctionActions.bidReceivedFromSocket, (state, { auction }) =>
    auctionAdapter.upsertOne(auction, state)
  ),

  on(AuctionActions.expireAuction, (state, { auctionId }) =>
    auctionAdapter.updateOne(
      {
        id: auctionId,
        changes: { status: false },
      },
      state
    )
  ),

  on(AuctionActions.loadUserBidsSuccess, (state, { userBids }) => ({
    ...state,
    userBids,
  })),
    on(AuctionActions.loadAuctionByIdSuccess, (state, { auction }) =>
    auctionAdapter.upsertOne(auction, {
      ...state,
      selectedAuctionId: auction.id,
      loading: false,
      error: null
    })
  ),

  on(AuctionActions.loadAuctionByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuctionActions.loadInitialAuctions, (state) => ({
    ...state,
    initialLoading: true,
    initialError: null,
  })),

  on(AuctionActions.loadInitialAuctionsSuccess, (state, action) => {
    const allAuctions = [...action.popular, ...action.recent, ...action.endingSoon];
    
    const newState = auctionAdapter.addMany(allAuctions, state);

    return {
      ...newState,
      popularAuctionIds: action.popular.map(a => a.id),
      recentAuctionIds: action.recent.map(a => a.id),
      endingSoonAuctionIds: action.endingSoon.map(a => a.id),
      initialLoading: false,
      initialError: null,
    };
  }),

  on(AuctionActions.loadInitialAuctionsFailure, (state, { error }) => ({
    ...state,
    initialLoading: false,
    initialError: 'Greška pri učitavanju: ' + error,
    popularAuctionIds: [],
    recentAuctionIds: [],
    endingSoonAuctionIds: [],
  })),
  
  on(AuctionActions.searchAuctions, (state) => ({
    ...state,
    searchLoading: true,
    searchError: null,
  })),

  on(AuctionActions.searchAuctionsSuccess, (state, { auctions }) => {
    const newState = auctionAdapter.upsertMany(auctions, state);

    return {
      ...newState,
      searchAuctionIds: auctions.map(a => a.id),
      searchLoading: false,
      searchError: null,
    };
  }),

  on(AuctionActions.clearSearch, (state) => ({
      ...state,
      searchAuctionIds: null,
      searchLoading: false,
      searchError: null,
  })),
  on(AuctionActions.loadUserAuctions, (state) => ({
    ...state,
    userAuctionsLoading: true,
    userAuctionsError: null,
  })),

  on(AuctionActions.loadUserAuctionsSuccess, (state, { auctions }) => {
    const newState = auctionAdapter.upsertMany(auctions, state); 
    return {
      ...newState,
      userAuctionIds: auctions.map(a => a.id),
      userAuctionsLoading: false,
      userAuctionsError: null,
    };
  }),

  on(AuctionActions.loadUserAuctionsFailure, (state, { error }) => ({
    ...state,
    userAuctionsLoading: false,
    userAuctionsError: error.message || 'Neuspelo učitavanje aukcija korisnika.',
  })),
  
  on(AuctionActions.addAuctionSuccess, (state, { auction }) => {
    const newState = auctionAdapter.addOne(auction, state);
    const newUserAuctionIds = [auction.id, ...(state.userAuctionIds || [])];
    
    return {
      ...newState,
      userAuctionIds: newUserAuctionIds,
      userAuctionsError: null, 
    };
  }),
);
