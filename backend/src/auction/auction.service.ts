import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './auction.entity';
import { Item } from '../item/item.entity';
import { User } from '../user/user.entity';
import { CreateAuctionItemDto } from '../dto/createItem.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createAuctionWithItem(
    dto: CreateAuctionItemDto,
    sellerId: string | number,
  ): Promise<Auction> {
    const sellerIdAsNumber = parseInt(sellerId as string, 10);

    const seller = await this.userRepository.findOne({
      where: { id: sellerIdAsNumber },
    });
    if (!seller) {
      throw new NotFoundException(`
        Korisnik sa ID ${sellerIdAsNumber} nije pronađen.`);
    }

    const newItem = this.itemRepository.create({
      naziv: dto.naziv,
      opis: dto.opis,
      kategorija: dto.kategorija,
      slike: dto.slike,
      stanje: dto.stanje,
      vlasnik: seller,
    });
    await this.itemRepository.save(newItem);

    const newAuction = this.auctionRepository.create({
      title: dto.title,
      description: dto.description,
      startingPrice: dto.startingPrice,
      seller: seller,
      active: true,
      items: [newItem],
    });

    const savedAuction = await this.auctionRepository.save(newAuction);

    newItem.auction = savedAuction;
    await this.itemRepository.save(newItem);

    return savedAuction;
  }
}
