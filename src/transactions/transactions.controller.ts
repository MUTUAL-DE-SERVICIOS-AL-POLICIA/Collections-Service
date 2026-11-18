import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { CollectionsService } from './transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @MessagePattern('collections.transactions.create')
  async create(@Payload() data: CreateTransactionDto) {
    return this.collectionsService.create(data);
  }

  // @MessagePattern('collections.transactions.update')
  // async update(@Payload() data: any) {
  //   return this.collectionsService.update(data);
  // }

  @MessagePattern('collections.transactions.findAll')
  async findAll() {
    return this.collectionsService.findAll();
  }

}
