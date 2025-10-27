import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Auction } from "../../models/auction.model";
import { MyBidDto } from "../../models/dtos/my.bid.dto";

export interface AuctionEntityState extends EntityState<Auction> {
  selectedAuctionId: number | null;
  loading: boolean;
  error: string | null;
  userBids: MyBidDto[];
  popularAuctionIds: number[] | null;
  recentAuctionIds: number[] | null;
  endingSoonAuctionIds: number[] | null;

  initialLoading: boolean; // frokJoin
  initialError: string | null;

  searchAuctionIds: number[] | null;
  searchLoading: boolean;
  searchError: string | null;
}

export const auctionAdapter = createEntityAdapter<Auction>({
  selectId: auction => auction.id
});

export const initialState: AuctionEntityState = auctionAdapter.getInitialState({
  selectedAuctionId: null,
  loading: false,
  error: null,
  userBids: [],
  popularAuctionIds: null,
  recentAuctionIds: null,
  endingSoonAuctionIds: null,
  initialLoading: false,
  initialError: null,
  searchAuctionIds: null,
  searchLoading: false,
  searchError: null,
});