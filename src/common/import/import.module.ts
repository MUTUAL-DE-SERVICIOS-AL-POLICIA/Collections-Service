// src/common/import/import.module.ts
import { Module } from '@nestjs/common';
import { ImportBatchService } from './import.service';

/**
 * Módulo global que provee ImportBatchService para cualquier módulo que lo necesite.
 * ImportBatchService contiene las funciones helper para imports:
 * - parseDate, parseAmount, getMaxId, importBatch, rollbackImport, validateDto
 */
@Module({
  providers: [ImportBatchService],
  exports: [ImportBatchService],
})
export class CommonImportModule {}
