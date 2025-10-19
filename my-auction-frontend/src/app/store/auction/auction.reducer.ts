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
  }))
);
