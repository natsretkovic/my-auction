import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
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

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @ManyToOne(() => User, (user) => user.auctions)
  seller: User;

  @OneToOne(() => Item, { cascade: true })
  @JoinColumn()
  item: Item;

  @OneToMany(() => Bid, (bid) => bid.auction, { cascade: true })
  bidsList: Bid[];
}
