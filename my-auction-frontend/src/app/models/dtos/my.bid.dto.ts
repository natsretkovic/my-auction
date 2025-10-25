import { Item } from "../item.model";
export interface MyBidDto {
  auctionId: number;
  item: Item;
  ended: boolean;
  userBid: number;
  highestBid: number;
  won: boolean;
}