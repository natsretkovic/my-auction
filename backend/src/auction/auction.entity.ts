import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Item } from '../item/item.entity';
import { Bid } from '../bid/bid.entity';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startingPrice: number;

  @Column({ default: false })
  active: boolean;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @ManyToOne(() => User, (user) => user.auctions)
  seller: User;

  @OneToMany(() => Item, (item) => item.auction, { cascade: true })
  items: Item[];

  @OneToMany(() => Bid, (bid) => bid.auction, { cascade: true })
  bidsList: Bid[];
}
