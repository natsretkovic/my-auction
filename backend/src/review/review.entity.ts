import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ocena: number;

  @Column()
  comment: string;

  @Column()
  sellerId: number;

  @Column()
  userId: number; //ostavlja review

  @ManyToOne(() => User, (user) => user.reviewsReceived, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @ManyToOne(() => User, (user) => user.reviewsGiven, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
