// src/common/import/import.module.ts
import { Module } from '@nestjs/common';
import { ImportService } from './import.service';

/**
 * Módulo global que provee ImportService para cualquier módulo que lo necesite.
 * ImportService contiene las funciones helper para imports:
 * - parseDate, parseAmount, getMaxId, importBatch, rollbackImport, validateDto
 */
@Module({
  providers: [ImportService],
  exports: [ImportService],
})
export class CommonImportModule {}
