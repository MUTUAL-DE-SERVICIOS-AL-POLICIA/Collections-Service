import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { CollectionsModule } from './collections/collections.module';
import { BankStatementModule } from './bank-statement/bank-statement.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, CommonModule, CollectionsModule, BankStatementModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
