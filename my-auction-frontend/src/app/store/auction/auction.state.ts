import { Auction } from "../../models/auction.model";

export interface AuctionState {
  auctions: Auction[];
  selectedAuction?: Auction;
  loading: boolean;
  error: string | null;
}

export const initialState: AuctionState = {
  auctions: [],
  loading: false,
  error: null,
};