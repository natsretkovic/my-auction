import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Auction } from '../auction/auction.entity';
import { User } from '../user/user.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ponuda: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Auction, (auction) => auction.bidsList)
  auction: Auction;

  @ManyToOne(() => User, (user) => user.bids)
  user: User;
}
