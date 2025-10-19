import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Auction } from './auction.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { CreateAuctionItemDto } from '../dto/createAuctionItem.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly dataSource: DataSource) {}

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
}
