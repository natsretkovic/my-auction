import { Bid } from "./bid.model";
import { Item } from "./item.model";

export interface Auction {
  id: number,
  naziv: string;
  opis: string;
  kategorija: string;
  stanje: string;
  startDate: string;
  endDate: string;
  slike?: string[];
  bidsList: Bid[];
  items: Item[];
  startingPrice: number;
}