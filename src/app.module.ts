import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { CollectionsModule } from './transactions/transactions.module';
import { BankStatementModule } from './bank-statements/bank-statements.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, CommonModule, CollectionsModule, BankStatementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
