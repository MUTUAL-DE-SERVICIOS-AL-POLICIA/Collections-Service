// src/bank-statement/bank-statement.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankStatement, ConciliationState } from './entities/bank-statement.entity';
import { CreateBankStatementDto, ImportBatchDto, UpdateBankStatementDto } from './dto/bank-statement.dto';
import { ImportProcessorService } from '../common/import/import-processor.service';

@Injectable()
export class BankStatementService {
  private readonly logger = new Logger('BankStatementService');

  constructor(
    @InjectRepository(BankStatement)
    private readonly repository: Repository<BankStatement>,
    private readonly importProcessorService: ImportProcessorService,
  ) {}

  async importBatch(batchDto: ImportBatchDto & { importId?: number }) {
    const cleanData: CreateBankStatementDto[] = [];

    for (const row of batchDto.data) {
      // Ignoramos filas que no tengan fecha o glosa (para evitar filas vacías del CSV)
      if (!row.date && !row.gloss) continue;

      cleanData.push({
        date: this.importProcessorService.parseDate(row.date),
        operationCode: row.operationCode,
        documentNumber: row.documentNumber,
        gloss: row.gloss,
        transferredAccount: row.transferredAccount || null,
        credits: this.importProcessorService.parseAmount(row.credits),
        state: row.state || ConciliationState.NO_CONCILIADO,
      });
    }

    return this.importProcessorService.importBatch(
      this.repository,
      cleanData,
      batchDto.isLastBatch,
      batchDto.importId || 0,
      CreateBankStatementDto,
    );
  }

  // --- CRUD ESTÁNDAR ---

  async findAll() {
    return this.repository.find({ order: { date: 'DESC' } });
  }

  async findOne(id: number) {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) throw new NotFoundException(`Extracto con id ${id} no encontrado`);
    return entity;
  }

  async update(id: number, updateDto: UpdateBankStatementDto) {
    await this.findOne(id);
    if (updateDto.credits) {
      updateDto.credits = this.importProcessorService.parseAmount(updateDto.credits);
    }
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
    return { message: 'Eliminado correctamente' };
  }
}