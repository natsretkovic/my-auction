import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ItemCategory } from 'src/enums/itemCategory.enum';
import { ItemStatus } from 'src/enums/itemStatus.enum';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  itemID: number;

  @Column()
  naziv: string;

  @Column({ type: 'text' })
  opis: string;

  @Column({
    type: 'enum',
    enum: ItemCategory,
    default: ItemCategory.OTHER,
  })
  kategorija: ItemCategory;

  @Column('simple-array', { nullable: true })
  slike: string[];

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.OTHER,
  })
  stanje: ItemStatus;

  @ManyToOne(() => User)
  vlasnik!: User;
}
