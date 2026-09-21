import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BankStatementService } from './bank-statements.service';
import { CreateBankStatementDto } from './dto/bank-statement.dto';

@Controller('bank-statements')
export class BankStatementController {
  constructor(
    private readonly bankStatementService: BankStatementService,
  ) {}

  @MessagePattern('collections.findAllBankStatements')
  async findAll() {
    return await this.bankStatementService.findAll();
  }

  @MessagePattern('collections.importBankStatements')
  async importTransactions(@Payload() data: { data: CreateBankStatementDto[] }) {
    return await this.bankStatementService.importBankStatements(data.data);
  }
}