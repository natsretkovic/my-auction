import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { User } from '../user/user.entity';
import { CreateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getReviewsForSeller(sellerId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { seller: { id: sellerId } },
      relations: ['user'],
    });
  }

  async getAverageRatingForSeller(sellerId: number): Promise<number> {
    const rawAverage = await this.reviewRepository.average('ocena', {
      seller: { id: sellerId },
    });
    const averageString = rawAverage as unknown as string | undefined;
    if (averageString && averageString !== 'null') {
      const averageNumber = parseFloat(averageString);
      return isNaN(averageNumber) ? 0 : averageNumber;
    }
    return 0;
  }

  async createReview(
    buyer: User,
    seller: User,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      ocena: createReviewDto.ocena,
      comment: createReviewDto.komentar,
      user: buyer,
      seller: seller,
    });
    return this.reviewRepository.save(review);
  }
}
