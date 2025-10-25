import { Bid } from "./bid.model";
import { Item } from "./item.model";

export interface Auction {
  id: number,
  startDate: string;
  endDate: string;
  bidsList: Bid[];
  item: Item;
  startingPrice: number;
  status: boolean; // 1 aktivna 0 istekla
}