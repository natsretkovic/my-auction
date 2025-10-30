import { ItemCategory } from "../../enums/itemCategory.enum";
import { ItemStatus } from "../../enums/itemStatus.enum";
export class UpdateItemDto {
  
}
export class UpdateAuctionDto {
  naziv?:string;
  opis?: string;
  kategorija?: ItemCategory; 
  stanje?: ItemStatus; 
  slike?: string[];
}