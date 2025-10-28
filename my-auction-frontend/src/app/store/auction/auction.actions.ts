import { createAction, props } from '@ngrx/store';
import { Auction } from '../../models/auction.model';
import { Bid } from '../../models/bid.model';
import { UpdateAuctionDto, UpdateItemDto } from '../../models/dtos/update.dto';
import { MyBidDto } from '../../models/dtos/my.bid.dto';

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
export const updateAuction = createAction(
  '[Auction Details] Update Auction Attempt',
  props<{ auctionId: number; data: UpdateAuctionDto }>()
);

export const updateAuctionSuccess = createAction(
  '[Auction API] Update Auction Success',
  props<{ auction: Auction }>()
);

export const updateAuctionFailure = createAction(
  '[Auction API] Update Auction Failure',
  props<{ error: any }>()
);

export const deleteAuction = createAction(
  '[Auction Details] Delete Auction Attempt',
  props<{ auctionId: number }>()
);

export const deleteAuctionSuccess = createAction(
  '[Auction API] Delete Auction Success',
  props<{ auctionId: number }>()
);

export const deleteAuctionFailure = createAction(
  '[Auction API] Delete Auction Failure',
  props<{ error: any }>()
);
/*export const expireAuction = createAction(
  '[Auction] Expire Auction',
  props<{ auctionId: number }>()
);

export const expireAuctionSuccess = createAction(
  '[Auction] Expire Auction Success',
  props<{ auctionId: number }>()
);

export const expireAuctionFailure = createAction(
  '[Auction] Expire Auction Failure',
  props<{ error: any }>()
);*/
export const loadUserBids = createAction('[Auction] Load User Bids');
export const loadUserBidsSuccess = createAction(
  '[Auction] Load User Bids Success',
  props<{ userBids: MyBidDto[] }>()
);
export const loadUserBidsFailure = createAction(
  '[Auction] Load User Bids Failure',
  props<{ error: any }>()
);
export const loadInitialAuctions = createAction(
    '[Auction Explorer] Load Initial Auctions'
);

export const loadInitialAuctionsSuccess = createAction(
    '[Auction API] Load Initial Auctions Success',
    props<{ 
        popular: Auction[], 
        recent: Auction[], 
        endingSoon: Auction[] 
    }>()
);

export const loadInitialAuctionsFailure = createAction(
    '[Auction API] Load Initial Auctions Failure',
    props<{ error: any }>()
);

export const searchAuctions = createAction(
    '[Auction Explorer] Search Auctions',
    props<{ keyword: string }>()
);

export const searchAuctionsSuccess = createAction(
    '[Auction API] Search Auctions Success',
    props<{ auctions: Auction[] }>()
);

export const searchAuctionsFailure = createAction(
    '[Auction API] Search Auctions Failure',
    props<{ error: any }>()
);
export const clearSearch = createAction(
    '[Auction Explorer] Clear Search Results'
);
export const loadUserAuctions = createAction(
  '[User Profile] Load User Auctions'
);

export const loadUserAuctionsSuccess = createAction(
  '[User Profile] Load User Auctions Success',
  props<{ auctions: Auction[] }>()
);

export const loadUserAuctionsFailure = createAction(
  '[User Profile] Load User Auctions Failure',
  props<{ error: any }>()
);
