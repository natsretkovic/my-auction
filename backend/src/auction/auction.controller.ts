/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuctionService } from './auction.service';
import { CreateAuctionItemDto } from '../dto/createAuctionItem.dto';

@Controller('auctions')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('addAuction')
  async addAuction(@Body() dto: CreateAuctionItemDto, @Req() req) {
    const sellerId = parseInt(req.user.userId, 10);
    const savedAuction = await this.auctionService.addAuction(dto, sellerId);
    return {
      message: 'Aukcija kreirana',
      auction: savedAuction,
    };
  }
}
