import { createReducer, on } from '@ngrx/store';
import * as AuctionActions from './auction.actions';
import { AuctionState, initialState } from './auction.state';

export const auctionFeatureKey = 'auction';


export const auctionReducer = createReducer(
  initialState,

  on(AuctionActions.loadAuctions, (state) => ({ ...state, loading: true, error: null })),
  on(AuctionActions.loadAuctionsSuccess, (state, { auctions }) => ({
    ...state,
    auctions,
    loading: false,
    error: null,
  })),
  on(AuctionActions.loadAuctionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuctionActions.addAuction, (state) => ({ ...state, loading: true, error: null })),
  on(AuctionActions.addAuctionSuccess, (state, { auction }) => ({
    ...state,
    auctions: [...state.auctions, auction],
    loading: false,
    error: null,
  })),
  on(AuctionActions.addAuctionFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuctionActions.selectAuction, (state, { auctionId }) => ({
    ...state,
    selectedAuction: state.auctions.find(a => a.id === auctionId),
  })),
  on(AuctionActions.loadAuctions, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuctionActions.loadAuctionsSuccess, (state, { auctions }) => ({
    ...state,
    auctions,
    loading: false
  })),
  on(AuctionActions.loadAuctionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuctionActions.addAuctionSuccess, (state, { auction }) => ({
    ...state,
    auctions: [...state.auctions, auction]
  })),
  on(AuctionActions.addAuctionFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(AuctionActions.loadAuctionById, state => ({
    ...state,
    loading: true,
    selectedAuction: null
  })),
  on(AuctionActions.loadAuctionByIdSuccess, (state, { auction }) => ({
    ...state,
    loading: false,
    selectedAuction: auction
  })),
  on(AuctionActions.loadAuctionByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuctionActions.placeBidSuccess, (state, { bid }) => ({
    ...state,
    selectedAuction: state.selectedAuction
      ? {
          ...state.selectedAuction,
          bidsList: [...state.selectedAuction.bidsList, bid]
        }
      : null
  })),
  on(AuctionActions.placeBidFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(AuctionActions.bidReceivedFromSocket, (state, { auction }) => {
    const updatedAuctions = state.auctions.map(a => 
        a.id === auction.id ? auction : a
    );

    return {
        ...state,
        auctions: updatedAuctions,
        selectedAuction: state.selectedAuction?.id === auction.id ? auction : state.selectedAuction,
    };
  }),
  on(AuctionActions.expireAuction, (state, { auctionId }) => {
  const updatedAuctions = state.auctions.map(a =>
    a.id === auctionId ? { ...a, status: false } : a
  );

  return {
    ...state,
    auctions: updatedAuctions,
    selectedAuction:
      state.selectedAuction?.id === auctionId
        ? { ...state.selectedAuction, status: false }
        : state.selectedAuction,
  };
 }),
 on(AuctionActions.loadUserBidsSuccess, (state, { userBids }) => ({
    ...state,
    userBids,
  }))
);
