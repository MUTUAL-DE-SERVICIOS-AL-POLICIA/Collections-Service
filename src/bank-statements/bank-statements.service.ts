// src/bank-statement/bank-statement.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankStatement } from './entities/bank-statement.entity';
import { CreateBankStatementDto } from './dto/bank-statement.dto';

@Injectable()
export class BankStatementService {
  private readonly logger = new Logger('BankStatementService');

  constructor(
    @InjectRepository(BankStatement)
    private readonly bankStatementRepository: Repository<BankStatement>,
  ) {}

  async findAll() {
    const bankStatements = await this.bankStatementRepository.find();
    return {
      error: false,
      message: 'Transacciones obtenidas correctamente',
      data: bankStatements,
    };
  }

  async importBankStatements(data: CreateBankStatementDto[]) {

    const formattedData: CreateBankStatementDto[] = data.map((item) => ({
      date: item.date,
      operationCode: item.operationCode,
      documentNumber: item.documentNumber,
      gloss: item.gloss,
      transferredAccount: item.transferredAccount,
      credits: Number(String(item.credits).replace(/,/g, '')),
      state: item.state,
    }));

    await this.bankStatementRepository.insert(formattedData);

    return {
      error: false,
      message: 'Transacciones importadas correctamente',
    };
  }

}