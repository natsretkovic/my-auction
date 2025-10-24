/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuctionService } from './auction.service';
import { CreateAuctionItemDto } from '../dto/createAuctionItem.dto';
import { Auction } from './auction.entity';

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
  @UseGuards(AuthGuard('jwt'))
  @Get('myAuctions')
  async getMyAuctions(@Req() req): Promise<Auction[]> {
    const userId = parseInt(req.user.userId, 10);
    return this.auctionService.getAuctionsByUser(userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('bid')
  async placeBid(
    @Req() req,
    @Body() body: { auctionId: number; amount: number },
  ) {
    return this.auctionService.placeBid(
      body.auctionId,
      req.user.userId,
      body.amount,
    );
  }
   @Get('popular')
  async getPopular(): Promise<Auction[]> {
    return this.auctionService.getPopularAuctions();
  }

  @Get('recent')
  async getRecent(): Promise<Auction[]> {
    return this.auctionService.getRecentAuctions();
  }

  @Get('endingSoon')
  async getEndingSoon(): Promise<Auction[]> {
    return this.auctionService.getEndingSoonAuctions();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getAuctionById(@Param('id', ParseIntPipe) id: number) {
    return this.auctionService.getAuctionById(id);
  }
}
