import { Module } from '@nestjs/common';
import { BankStatementModule } from './bank-statement/bank-statement.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TransactionsModule, BankStatementModule],
  exports: [TransactionsModule, BankStatementModule],
})
export class CollectionsModule {}
