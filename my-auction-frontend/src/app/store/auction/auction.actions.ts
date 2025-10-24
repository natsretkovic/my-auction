import { createAction, props } from '@ngrx/store';
import { Auction } from '../../models/auction.model';
import { Bid } from '../../models/bid.model';

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
export const loadAuctionById = createAction(
  '[Auction Details] Load Auction By Id',
  props<{ id: number }>()
);

export const loadAuctionByIdSuccess = createAction(
  '[Auction API] Load Auction By Id Success',
  props<{ auction: Auction }>()
);

export const loadAuctionByIdFailure = createAction(
  '[Auction API] Load Auction By Id Failure',
  props<{ error: string }>()
);

export const placeBid = createAction(
  '[Auction Details] Place Bid',
  props<{ auctionId: number; bidAmount: number }>()
);

export const placeBidSuccess = createAction(
  '[Auction API] Place Bid Success',
  props<{ bid: Bid }>()
);

export const placeBidFailure = createAction(
  '[Auction API] Place Bid Failure',
  props<{ error: string }>()
);
export const bidReceivedFromSocket = createAction(
  '[Auction] Bid Received From Socket',
  props<{ auction: Auction }>()
);
export const joinAuctionRoom = createAction(
  '[Auction Details] Join Auction Socket Room',
  props<{ auctionId: number }>()
);
