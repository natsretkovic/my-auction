import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async findAllByUserId(userId: string): Promise<Item[]> {
    try {
      return await this.itemRepository
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.user', 'user')
        .where('user.id = :userId', { userId })
        .getMany();
    } catch (error) {
      console.error('Greška pri dohvatanju predmeta za korisnika', error);
      return [];
    }
  }
}
