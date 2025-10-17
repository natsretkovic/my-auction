/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuctionService } from './auction.service';
import { CreateAuctionItemDto } from '../dto/createItem.dto';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post() // POST /auctions
  @UseGuards(AuthGuard('jwt'))
  async createAuction(
    @Body() createAuctionItemDto: CreateAuctionItemDto,
    @Req() req,
  ) {
    const sellerId = req.user.userId;
    return this.auctionService.createAuctionWithItem(
      createAuctionItemDto,
      sellerId,
    );
  }
}
