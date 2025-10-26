import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { Auction } from './auction.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { Bid } from 'src/bid/bid.entity';
import { AuctionGateway } from './auction.gateway';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, Item, User, Bid]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionGateway],
})
export class AuctionModule {}
