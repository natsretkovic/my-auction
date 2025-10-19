import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { Auction } from './auction.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Item, User])],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
