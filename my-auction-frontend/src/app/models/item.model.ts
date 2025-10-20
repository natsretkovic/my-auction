import { User } from './user.model';
import { ItemCategory } from '../enums/itemCategory.enum';
import { ItemStatus } from '../enums/itemStatus.enum';

export interface Item {
  itemID: number;
  naziv: string;
  opis: string;
  kategorija: ItemCategory;
  slike?: string[];
  stanje: ItemStatus;
  vlasnik?: User;
  auctionId?: number;
}
