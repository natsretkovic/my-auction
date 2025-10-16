import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Auction } from '../auction/auction.entity';
import { Review } from '../review/review.entity';
import { Bid } from '../bid/bid.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  ime: string;

  @Column()
  prezime: string;

  @Column()
  brojTelefona: string;

  @OneToMany(() => Auction, (auction) => auction.seller)
  auctions: Auction[];

  @OneToMany(() => Review, (review) => review.seller)
  reviewsReceived: Review[];

  @OneToMany(() => Review, (review) => review.user)
  reviewsGiven: Review[];

  @OneToMany(() => Bid, (bid) => bid.user)
  bids: Bid[];
}
