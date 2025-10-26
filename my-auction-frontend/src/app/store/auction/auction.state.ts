import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Auction } from "../../models/auction.model";
import { MyBidDto } from "../../models/dtos/my.bid.dto";

export interface AuctionEntityState extends EntityState<Auction> {
  selectedAuctionId: number | null;
  loading: boolean;
  error: string | null;
  userBids: MyBidDto[];
}

export const auctionAdapter = createEntityAdapter<Auction>({
  selectId: auction => auction.id
});

export const initialState: AuctionEntityState = auctionAdapter.getInitialState({
  selectedAuctionId: null,
  loading: false,
  error: null,
  userBids: []
});