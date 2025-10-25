/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

@Injectable()
export class AuctionService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
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
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        item: newItem,
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
  async getPopularAuctions(): Promise<Auction[]> {
    return [
      {
        id: 1,
        startingPrice: 1000,
        active: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3600 * 1000),
        seller: { id: 1, username: 'Prodavac1' } as any,
        item: {
          itemId: 1,
          naziv: 'Predmet 1',
          slike: ['https://placehold.co/200x200'],
        } as any,
        bidsList: [],
      } as unknown as Auction,
    ];
    /*return this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.bidsList', 'bid')
      .leftJoinAndSelect('auction.items', 'item')
      .leftJoinAndSelect('auction.seller', 'seller')
      .loadRelationCountAndMap('auction.bidCount', 'auction.bidsList')
      .orderBy('auction.bidCount', 'DESC')
      .take(10)
      .getMany();*/
  }
  async getRecentAuctions(): Promise<Auction[]> {
    return this.auctionRepository.find({
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

  async deleteAuction(auctionId: number, userId: number): Promise<void> {
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
      relations: ['seller'],
    });

    if (!auction) {
      throw new NotFoundException(`Ne postoji`);
    }
    if (auction.seller.id !== userId) {
      throw new ForbiddenException('Možete obrisati samo sopstvene aukcije.');
    }

    const result = await this.auctionRepository.delete(auctionId);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Aukcija ID ${auctionId} nije pronađena za brisanje.`,
      );
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
    });

    return bids.map((bid) => {
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
