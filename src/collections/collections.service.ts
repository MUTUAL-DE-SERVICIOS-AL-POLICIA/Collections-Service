import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transactions.dto';

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger(CollectionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(data: CreateTransactionDto): Promise<{
    error: boolean;
    message: string;
    data: Transaction | null;
  }> {
    try {
      const transaction = this.transactionRepository.create(data);
      const savedTransaction =
        await this.transactionRepository.save(transaction);

      return {
        error: false,
        message: 'Transacción registrada correctamente',
        data: savedTransaction,
      };
    } catch (error) {
      const exception =
        error instanceof Error ? error : new Error(String(error));

      this.logger.error(
        `Error al registrar la transacción: ${exception.message}`,
        exception.stack,
      );

      return {
        error: true,
        message: 'Error al registrar la transacción',
        data: null,
      };
    }
  }
}
