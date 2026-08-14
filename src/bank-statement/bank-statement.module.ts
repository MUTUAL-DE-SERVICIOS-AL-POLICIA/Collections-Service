// src/bank-statement/bank-statement.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankStatementService } from './bank-statement.service';
import { BankStatementController } from './bank-statement.controller';
import { BankStatement } from './entities/bank-statement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankStatement])],
  controllers: [BankStatementController],
  providers: [BankStatementService],
})
export class BankStatementModule {}