/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource, Repository, Between } from 'typeorm';
import { Auction } from './auction.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { CreateAuctionItemDto } from '../dto/createAuctionItem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/bid/bid.entity';
import { AuctionGateway } from './auction.gateway';
import { UpdateAuctionDto, UpdateItemDto } from 'src/dto/update.dto';

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
      relations: ['items', 'items.vlasnik', 'bidsList', 'bidsList.user'],
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
        items: [
          {
            id: 1,
            naziv: 'Predmet 1',
            slike: ['https://placehold.co/200x200'],
          } as any,
        ],
        bidsList: [],
      } as Auction,
      {
        id: 2,
        startingPrice: 2000,
        active: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7200 * 1000),
        seller: { id: 2, username: 'Prodavac2' } as any,
        items: [
          {
            id: 2,
            naziv: 'Predmet 2',
            slike: ['https://placehold.co/200x200'],
          } as any,
        ],
        bidsList: [],
      } as Auction,
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
      relations: ['items', 'items.vlasnik', 'bidsList', 'seller'],
      order: { startDate: 'DESC' },
      take: 10,
    });
  }
  async getEndingSoonAuctions(): Promise<Auction[]> {
    const now = new Date();
    const next24h = new Date();
    next24h.setHours(now.getHours() + 24);

    return this.auctionRepository.find({
      where: { endDate: Between(now, next24h), active: true },
      relations: ['items', 'items.vlasnik', 'bidsList', 'seller'],
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
      relations: ['seller', 'items', 'bidsList'],
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

    if (updateData.itemUpdate && auction.items && auction.items.length > 0) {
      const item: Item = auction.items[0];
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
}
