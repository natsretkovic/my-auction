export interface Auction {
  id: number,
  naziv: string;
  opis: string;
  kategorija: string;
  stanje: string;
  startDate: string;
  endDate: string;
  slike?: string[];
  startingPrice: number;
}