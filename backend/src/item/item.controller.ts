// item/item.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('my-listings/:userId')
  async getMyItems(@Param('userId') userId: string) {
    if (!userId) {
      throw new NotFoundException('Id je obavezan');
    }
    const userItems = await this.itemService.findAllByUserId(userId);

    return userItems;
  }
}
