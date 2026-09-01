import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-transactions.dto';
import { CollectionsService } from './transactions.service';

@Controller()
export class TransactionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @MessagePattern('collections.createTransaction')
  async add(@Payload() data: CreateTransactionDto) {
    return this.collectionsService.createTransaction(data);
  }

  @MessagePattern('collections.findAll')
  async findAll() {
    return this.collectionsService.findAll();
  }

}
