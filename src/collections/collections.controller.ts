import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CollectionsService } from './collections.service';
import { CreateTransactionDto } from './dto/create-transactions.dto';

@Controller()
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @MessagePattern('collections.add')
  async add(@Payload() data: CreateTransactionDto) {
    return this.collectionsService.createTransaction(data);
  }
}
