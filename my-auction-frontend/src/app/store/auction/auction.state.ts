import { Auction } from "../../models/auction.model";
import { MyBidDto } from "../../models/dtos/my.bid.dto";

export interface AuctionState {
  auctions: Auction[];
  selectedAuction?: Auction | null;
  loading: boolean;
  error: string | null;
  userBids: MyBidDto[]
}

export const initialState: AuctionState = {
  auctions: [],
  loading: false,
  error: null,
  userBids: []
};