import { ItemCategory } from 'src/enums/itemCategory.enum';
import { ItemStatus } from 'src/enums/itemStatus.enum';

export class CreateAuctionItemDto {
  naziv: string;
  opis: string;
  kategorija: ItemCategory;
  slike: string[];
  stanje: ItemStatus;
  startingPrice: number;
  startDate: string;
  endDate: string;
}
