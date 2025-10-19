import { createAction, props } from '@ngrx/store';
import { Auction } from '../../models/auction.model';

export const loadAuctions = createAction('[Auction] Load Auctions');
export const loadAuctionsSuccess = createAction(
  '[Auction] Load Auctions Success',
  props<{ auctions: Auction[] }>()
);
export const loadAuctionsFailure = createAction(
  '[Auction] Load Auctions Failure',
  props<{ error: string }>()
);

export const addAuction = createAction(
  '[Auction] Add Auction',
  props<{ auction: Auction }>()
);
export const addAuctionSuccess = createAction(
  '[Auction] Add Auction Success',
  props<{ auction: Auction }>()
);
export const addAuctionFailure = createAction(
  '[Auction] Add Auction Failure',
  props<{ error: string }>()
);

export const selectAuction = createAction(
  '[Auction] Select Auction',
  props<{ auctionId: number }>()
);
