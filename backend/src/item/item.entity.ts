import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Auction } from '../auction/auction.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  itemID: number;

  @Column()
  naziv: string;

  @Column({ type: 'text' })
  opis: string;

  @Column()
  kategorija: string;

  @Column('simple-array', { nullable: true })
  slike: string[];

  @Column()
  stanje: string;

  @ManyToOne(() => User, (user) => user.auctions)
  vlasnik!: User;

  @ManyToOne(() => Auction, (auction) => auction.items)
  auction!: Auction;
}
