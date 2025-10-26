/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from '../dto/review.dto';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  @Get('seller/:id')
  async getReviewsForSeller(@Param('id', ParseIntPipe) sellerId: number) {
    return this.reviewService.getReviewsForSeller(sellerId);
  }

  @Get('seller/:id/average')
  async getAverageRatingForSeller(@Param('id', ParseIntPipe) sellerId: number) {
    return this.reviewService.getAverageRatingForSeller(sellerId);
  }

  @Post('seller/:id')
  async createReview(
    @Param('id', ParseIntPipe) sellerId: number,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    const buyer = req.user;
    const seller = await this.userService.findUserById(sellerId);
    if (!seller) {
      throw new NotFoundException('Seller not found.');
    }
    return this.reviewService.createReview(buyer, seller, createReviewDto);
  }
}
