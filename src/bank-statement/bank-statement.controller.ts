// src/bank-statement/bank-statement.controller.ts
import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BankStatementService } from './bank-statement.service';
import { UpdateBankStatementDto } from './dto/bank-statement.dto';
import { ImportProcessorService } from '../common/import/import-processor.service';

@Controller('bank-statements')
export class BankStatementController {
  constructor(
    private readonly service: BankStatementService,
    private readonly importProcessorService: ImportProcessorService,
  ) {}

  /**
   * Escucha los lotes enviados desde el Global-Service vía NATS.
   * El patrón se genera dinámicamente como {microservice}.{table}.importBatch
   * según la configuración en import_configs del Gateway.
   */
  @MessagePattern('collections.bank_statements.importBatch')
  async handleImportBatch(@Payload() data: any) {
    return this.service.importBatch(data);
  }

  /**
   * Devuelve el MAX(id) de cualquier tabla.
   * Gateway pasa { tableName, schema } desde import_configs.
   * Sirve para cualquier tabla futura.
   */
  @MessagePattern('collections.getMaxId')
  async handleGetMaxId(@Payload() data: { tableName: string; schema?: string }) {
    const maxId = await this.importProcessorService.getMaxId(data.tableName, data.schema);
    return { maxId };
  }

  /**
   * Recibe una solicitud de rollback desde el Gateway cuando una
   * importación falla. Elimina todos los lotes que ya se insertaron
   * para ese importId, dejando la tabla destino como si nunca
   * se hubiera importado nada.
   */
  @MessagePattern('collections.rollbackImport')
  async handleRollbackImport(@Payload() data: { importId: number }) {
    await this.importProcessorService.rollbackImport(data.importId);
    return { rolledBack: true };
  }

  /**
   * Rutas del CRUD estándar (Se accede a través del Gateway HTTP -> NATS)
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateBankStatementDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}