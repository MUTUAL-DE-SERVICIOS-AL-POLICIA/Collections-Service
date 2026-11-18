import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities';
import { TransactionsController } from './transactions.controller';
import { CollectionsService } from './transactions.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      
    ]),
  ],
  controllers: [TransactionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
