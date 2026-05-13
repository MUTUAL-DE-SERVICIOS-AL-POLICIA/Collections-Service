import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankStatementEntity } from './bank-statement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankStatementEntity])],
  exports: [TypeOrmModule],
})
export class BankStatementModule {}
