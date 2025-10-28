import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository, Between, LessThan } from 'typeorm';
import { Auction } from './auction.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { CreateAuctionItemDto } from '../dto/createAuctionItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/bid/bid.entity';
import { AuctionGateway } from './auction.gateway';
import { UpdateAuctionDto, UpdateItemDto } from 'src/dto/update.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ItemCategory } from 'src/enums/itemCategory.enum';

@Injectable()
export class AuctionService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    private readonly auctionGateway: AuctionGateway,
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
        status: true,
        seller: seller,
        startDate: new Date(),
        endDate: new Date(dto.endDate),
        item: newItem,
      });
      const savedAuction = await manager.save(Auction, newAuction);

      return savedAuction;
    });
  }
  async getAuctionsByUser(userId: number): Promise<Auction[]> {
    return this.auctionRepository.find({
      where: { seller: { id: userId } },
      relations: ['item', 'item.vlasnik', 'bidsList', 'seller'],
    });
  }
  async placeBid(
    auctionId: number,
    userId: number,
    amount: number,
  ): Promise<Bid> {
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
      relations: ['item', 'item.vlasnik'],
    });

    if (!auction) {
      throw new NotFoundException(`Aukcija sa ID ${auctionId} nije pronađena`);
    }

    const isOwner = auction.item.vlasnik?.id === userId;
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
    const savedBid = await this.bidRepository.save(bid);
    const updatedAuction = await this.getAuctionById(auctionId);

    const roomName = `auction:${auctionId}`;
    this.auctionGateway.server
      .to(roomName)
      .emit('newBid', { newAuction: updatedAuction });

    return savedBid;
  }
  async getAuctionById(id: number): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['item', 'item.vlasnik', 'bidsList', 'bidsList.user'],
    });

    if (!auction) {
      throw new NotFoundException(`Aukcija sa ID ${id} nema`);
    }

    return auction;
  }
  async getPopularAuctions(limit: number = 10): Promise<Auction[]> {
    return await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.item', 'item')
      .innerJoin('auction.bidsList', 'bid')
      .where('auction.status = :status', { status: true })
      .groupBy('auction.id')
      .addGroupBy('item.itemID')
      .orderBy('COUNT(bid.id)', 'DESC')
      .limit(limit)
      .getMany();
  }
  async getRecentAuctions(): Promise<Auction[]> {
    return this.auctionRepository.find({
      where: { status: true },
      relations: ['item', 'item.vlasnik', 'bidsList', 'seller'],
      order: { startDate: 'DESC' },
      take: 10,
    });
  }
  async getEndingSoonAuctions(): Promise<Auction[]> {
    const now = new Date();
    const next24h = new Date();
    next24h.setHours(now.getHours() + 24);

    return this.auctionRepository.find({
      where: { endDate: Between(now, next24h), status: true },
      relations: ['item', 'item.vlasnik', 'bidsList', 'seller'],
      order: { endDate: 'ASC' },
    });
  }
  async updateAuction(
    auctionId: number,
    userId: number,
    updateData: UpdateAuctionDto,
  ): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
      relations: ['seller', 'item', 'bidsList'],
    });

    if (!auction) {
      throw new NotFoundException(`Aukcija ID ${auctionId} nije pronađena.`);
    }

    if (auction.seller.id !== userId) {
      throw new ForbiddenException('Možete menjati samo sopstvene aukcije.');
    }

    if (updateData.endDate) {
      const newEndDate = new Date(updateData.endDate);

      if (isNaN(newEndDate.getTime())) {
        throw new BadRequestException('Neispravan format datuma za endDate.');
      }

      if (newEndDate.getTime() <= auction.endDate.getTime()) {
        throw new ForbiddenException(
          'Nije moguće skratiti trajanje aukcije, samo ga produžiti.',
        );
      }
      auction.endDate = newEndDate;
    }

    if (updateData.itemUpdate && auction.item) {
      const item: Item = auction.item;
      const itemUpdate: UpdateItemDto = updateData.itemUpdate;

      if (itemUpdate.opis) item.opis = itemUpdate.opis;
      if (itemUpdate.kategorija) item.kategorija = itemUpdate.kategorija;
      if (itemUpdate.stanje) item.stanje = itemUpdate.stanje;
      if (itemUpdate.slike) item.slike = itemUpdate.slike;

      await this.dataSource.manager.save(Item, item);
    }

    return this.auctionRepository.save(auction);
  }

  async deleteAuction(id: number): Promise<void> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['item', 'bidsList'],
    });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found.`);
    }

    if (auction.bidsList?.length) {
      await this.bidRepository.delete({ auction: { id: auction.id } });
    }

    await this.auctionRepository.delete(id);

    if (auction.item) {
      await this.itemRepository.delete(auction.item.itemID);
    }
  }
  async expireAuction(auctionId: number): Promise<Auction> {
    const auction = await this.getAuctionById(auctionId);

    if (!auction.status) return auction;

    auction.status = false;

    const updatedAuction = await this.auctionRepository.save(auction);

    const roomName = `auction:${auctionId}`;
    this.auctionGateway.server
      .to(roomName)
      .emit('auctionExpired', { auction: updatedAuction });

    return updatedAuction;
  }

  async searchAuctions(keyword: string): Promise<Auction[]> {
    const queryBuilder = this.auctionRepository.createQueryBuilder('auction');
    queryBuilder.innerJoinAndSelect('auction.item', 'item');
    queryBuilder.leftJoinAndSelect('auction.bidsList', 'bidsList');
    queryBuilder.where('auction.status = :status', { status: true });

    if (keyword) {
      const normalizedKeyword = keyword.trim().toLowerCase();

      const enumValues = Object.values(ItemCategory);
      const matchedCategory = enumValues.find(
        (val) => val.toLowerCase() === normalizedKeyword,
      );

      if (matchedCategory) {
        queryBuilder.andWhere(
          '(LOWER(item.naziv) LIKE :keyword OR item.kategorija = :category)',
          {
            keyword: `%${normalizedKeyword}%`,
            category: matchedCategory,
          },
        );
      } else {
        queryBuilder.andWhere('LOWER(item.naziv) LIKE :keyword', {
          keyword: `%${normalizedKeyword}%`,
        });
      }
    }

    return await queryBuilder.getMany();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleExpiredAuctions() {
    await this.expireAllExpiredAuctions();
  }

  async expireAllExpiredAuctions(): Promise<void> {
    const now = new Date();

    const expiredAuctions = await this.auctionRepository.find({
      where: { status: true, endDate: LessThan(now) },
      relations: ['item', 'seller', 'bidsList'],
    });

    for (const auction of expiredAuctions) {
      await this.expireAuction(auction.id);
    }

    console.log(`${expiredAuctions.length} aukcija je završeno.`);
  }
  async getUserBids(userId: number) {
    const bids = await this.bidRepository.find({
      where: { user: { id: userId } },
      relations: [
        'auction',
        'auction.item',
        'auction.bidsList',
        'auction.seller',
      ],
      order: { id: 'DESC' },
    });

    const highestBidsPerAuction = bids.reduce(
      (acc, bid) => {
        if (!acc.find((b) => b.auction.id === bid.auction.id)) {
          acc.push(bid);
        }
        return acc;
      },
      [] as typeof bids,
    );

    return highestBidsPerAuction.map((bid) => {
      const auction = bid.auction;
      const highestBid = Math.max(...auction.bidsList.map((b) => b.ponuda));

      return {
        auctionId: auction.id,
        item: auction.item,
        ended: !auction.status,
        userBid: bid.ponuda,
        highestBid,
        won: !auction.status && bid.ponuda === highestBid,
      };
    });
  }
}
