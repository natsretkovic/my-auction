/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuctionService } from './auction.service';
import { CreateAuctionItemDto } from '../dto/createAuctionItem.dto';
import { Auction } from './auction.entity';
import { UpdateAuctionDto } from 'src/dto/update.dto';

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
  @Get('my-bids')
  async getMyBids(@Req() req) {
    const userId = parseInt(req.user.userId, 10);
    return this.auctionService.getUserBids(userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getAuctionById(@Param('id', ParseIntPipe) id: number) {
    return this.auctionService.getAuctionById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateAuction(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() updateData: UpdateAuctionDto,
  ): Promise<Auction> {
    const userId = parseInt(req.user.userId, 10);
    return this.auctionService.updateAuction(id, userId, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAuction(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<void> {
    const userId = parseInt(req.user.userId, 10);
    await this.auctionService.deleteAuction(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/expire')
  expireAuction(@Param('id') id: number) {
    return this.auctionService.expireAuction(+id);
  }
}
