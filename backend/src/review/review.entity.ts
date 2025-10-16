import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ocena: number;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.reviewsReceived)
  seller: User;

  @ManyToOne(() => User, (user) => user.reviewsGiven)
  user: User;
}
