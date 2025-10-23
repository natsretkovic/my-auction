import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { CreateAuctionItemDto } from '../dto/createAuctionItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/bid/bid.entity';

@Injectable()
export class AuctionService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
  ) {}

  async addAuction(
    dto: CreateAuctionItemDto,
    sellerId: number,
  ): Promise<Auction> {
    return this.dataSource.transaction(async (manager) => {
      const seller = await manager.findOne(User, { where: { id: sellerId } });
      if (!seller)
        throw new NotFoundException(
          `Korisnik sa ID ${sellerId} nije pronađen.`,
        );
      const newItem = manager.create(Item, {
        naziv: dto.naziv,
        opis: dto.opis,
        kategorija: dto.kategorija,
        stanje: dto.stanje,
        slike: dto.slike || [],
        vlasnik: seller,
      });
      await manager.save(Item, newItem);
      const newAuction = manager.create(Auction, {
        startingPrice: dto.startingPrice,
        active: true,
        seller: seller,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        items: [newItem],
      });
      const savedAuction = await manager.save(Auction, newAuction);
      newItem.auction = savedAuction;
      await manager.save(Item, newItem);

      return savedAuction;
    });
  }
  async getAuctionsByUser(userId: number): Promise<Auction[]> {
    return this.auctionRepository.find({
      where: { seller: { id: userId } },
      relations: ['items', 'bidsList', 'seller'],
    });
  }
  async placeBid(
    auctionId: number,
    userId: number,
    amount: number,
  ): Promise<Bid> {
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
      relations: ['items', 'items.vlasnik'],
    });

    if (!auction) {
      throw new NotFoundException(`Aukcija sa ID ${auctionId} nije pronađena`);
    }

    const isOwner = auction.items.some((item) => item.vlasnik?.id === userId);
    if (isOwner) {
      throw new ForbiddenException(
        'Ne možete licitirati na sopstvenu aukciju.',
      );
    }

    const bid = this.bidRepository.create({
      ponuda: amount,
      auction: { id: auctionId } as Auction,
      user: { id: userId } as User,
    });

    return this.bidRepository.save(bid);
  }
  async getAuctionById(id: number): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['items', 'items.vlasnik', 'bidsList', 'bidsList.user'],
    });

    if (!auction) {
      throw new NotFoundException(`Aukcija sa ID ${id} nema`);
    }

    return auction;
  }
}
