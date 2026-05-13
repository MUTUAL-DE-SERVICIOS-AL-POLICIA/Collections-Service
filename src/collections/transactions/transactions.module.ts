import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsEntity } from './transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionsEntity])],
  exports: [TypeOrmModule],
})
export class TransactionsModule {}
