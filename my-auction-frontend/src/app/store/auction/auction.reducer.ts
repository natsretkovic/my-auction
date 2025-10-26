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
      selectedAuctionId: auction.id, // postavi selektovanu aukciju
      loading: false,
      error: null
    })
  ),

  on(AuctionActions.loadAuctionByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
