import { ItemCategory } from "../../enums/itemCategory.enum";
import { ItemStatus } from "../../enums/itemStatus.enum";
export class UpdateItemDto {
  opis?: string;
  kategorija?: ItemCategory; 
  stanje?: ItemStatus; 
  slike?: string[];
}
export class UpdateAuctionDto {
  endDate?: string;
  itemUpdate?: UpdateItemDto; 
}