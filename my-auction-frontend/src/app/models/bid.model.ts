import { Auction } from './auction.model';
import { User } from './user.model';
export interface Bid {
  id: number;
  ponuda: number;
  createdAt: string;
  auction?: Auction;
  user?: User;
}