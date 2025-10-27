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
  UnauthorizedException,
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
    console.log(' req.user:', req.user);

    const dajeOcenuObj: any = req.user;

    if (!dajeOcenuObj || !dajeOcenuObj.userId) {
      console.error('req.user nedostaje userId.');
      throw new UnauthorizedException('Korisnik nije prijavljen');
    }

    const dobijaOcenuObj = await this.userService.findUserById(sellerId);

    if (!dobijaOcenuObj) {
      throw new NotFoundException('Nema ko dobija ocenu');
    }

    const dajeOcenuId = { id: dajeOcenuObj.userId };
    const dobijaOcenuId = { id: dobijaOcenuObj.id };

    return this.reviewService.createReview(
      dajeOcenuId,
      dobijaOcenuId,
      createReviewDto,
    );
  }
}
