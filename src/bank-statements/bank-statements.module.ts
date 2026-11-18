// src/bank-statement/bank-statement.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankStatementController } from './bank-statements.controller';
import { BankStatementService } from './bank-statements.service';
import { BankStatement } from './entities/bank-statement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankStatement])],
  controllers: [BankStatementController],
  providers: [BankStatementService],
})
export class BankStatementModule {}