// src/common/import/import-processor.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { DbEnvs } from '../../config';

export interface BatchResult {
  processed: number;
  isLastBatch: boolean;
  idStart: number | null;
  idEnd: number | null;
}

interface BatchRange {
  ids: number[];
}

interface ImportInfo {
  schema: string;
  tableName: string;
}

@Injectable()
export class ImportProcessorService {
  private readonly logger = new Logger('ImportProcessorService');

/**
 * Rastrea los lotes insertados por cada importación activa.
 * key = importId (ImportRecord.id)
 * value = arreglo de rangos de IDs insertados
 */
private readonly batchTracker = new Map<number, BatchRange[]>();

/**
 * Almacena el schema y nombre de la tabla asociada a cada importación,
 * necesario para hacer rollback con SQL raw sin depender del Repository.
 * key = importId (ImportRecord.id)
 * value = { schema, tableName }
 */
private readonly importInfo = new Map<number, ImportInfo>();

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Limpia el formato de los números (ej: "1,120.05" -> 1120.05)
   */
  parseAmount(value: any): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const cleanValue = String(value).replace(/,/g, '');
    const num = parseFloat(cleanValue);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Convierte un valor a string de fecha ISO 8601 con timezone (YYYY-MM-DDTHH:mm:ss.sssZ).
   * - Si es un número, se interpreta como serial de Excel (días desde 1899-12-30).
   * - Si es un objeto Date, se serializa como ISO.
   * - Si es string y ya tiene formato ISO (YYYY-MM-DD...), se completa con T00:00:00.000Z.
   * - Si es string con formato DD/MM/YYYY o DD-MM-YYYY, se convierte a ISO.
   * - Si es string con formato MM/DD/YYYY, se convierte a ISO (asume mes/día/año).
   */
  parseDate(value: any): string {
    if (!value) return '';
    // Si es string numérico (ej: "46097" desde CSV), convertir a número
    if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value.trim())) {
      value = Number(value);
    }
    if (typeof value === 'number') {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const date = new Date(excelEpoch.getTime() + value * 86400000);
      return date.toISOString();
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    const str = String(value).trim();
    // Si ya empieza con YYYY-MM-DD, probablemente ya es ISO, completar con T00:00:00.000Z
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      if (str.includes('T')) {
        // Validar que la fecha ISO sea válida
        const dateObj = new Date(str);
        if (!isNaN(dateObj.getTime())) {
          return str;
        }
      } else {
        // Validar que YYYY-MM-DD sea válido
        const [y, m, d] = str.split('-').map(Number);
        const dateObj = new Date(Date.UTC(y, m - 1, d));
        if (dateObj.getUTCFullYear() === y && dateObj.getUTCMonth() === m - 1 && dateObj.getUTCDate() === d) {
          return `${str}T00:00:00.000Z`;
        }
      }
    }
    // Intentar DD/MM/YYYY o DD-MM-YYYY
    const partsSlash = str.split('/');
    const partsDash = str.split('-');
    if (partsSlash.length === 3 && partsSlash[0] && partsSlash[1] && partsSlash[2]) {
      const [d, m, y] = partsSlash;
      const dateObj = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)));
      if (dateObj.getUTCFullYear() === parseInt(y) && dateObj.getUTCMonth() === parseInt(m) - 1 && dateObj.getUTCDate() === parseInt(d)) {
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00.000Z`;
      }
    }
    if (partsDash.length === 3 && partsDash[0] && partsDash[1] && partsDash[2]) {
      // DD-MM-YYYY o MM-DD-YYYY — asumimos DD-MM-YYYY si el primer valor > 12
      const [a, b, y] = partsDash;
      if (parseInt(a) > 12) {
        // probablemente DD-MM-YYYY
        const dateObj = new Date(Date.UTC(parseInt(y), parseInt(b) - 1, parseInt(a)));
        if (dateObj.getUTCFullYear() === parseInt(y) && dateObj.getUTCMonth() === parseInt(b) - 1 && dateObj.getUTCDate() === parseInt(a)) {
          return `${y}-${b.padStart(2, '0')}-${a.padStart(2, '0')}T00:00:00.000Z`;
        }
      } else {
        // probablemente MM-DD-YYYY
        const dateObj = new Date(Date.UTC(parseInt(y), parseInt(a) - 1, parseInt(b)));
        if (dateObj.getUTCFullYear() === parseInt(y) && dateObj.getUTCMonth() === parseInt(a) - 1 && dateObj.getUTCDate() === parseInt(b)) {
          return `${y}-${a.padStart(2, '0')}-${b.padStart(2, '0')}T00:00:00.000Z`;
        }
      }
    }
    // Si ningún formato funcionó, lanzar error con el valor original
    throw new Error(`Fecha inválida: "${str}". Use formato YYYY-MM-DD, DD/MM/YYYY, o serial de Excel.`);
  }

  /**
   * Valida que un nombre de tabla o schema sea seguro para usar en SQL.
   * Solo permite caracteres alfanuméricos y underscores.
   * Previene SQL injection.
   */
  private validateSqlIdentifier(name: string): void {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      throw new BadRequestException(`Identificador SQL inválido: "${name}". Solo se permiten letras, números y guiones bajos.`);
    }
  }

  /**
   * Obtiene el MAX(id) de cualquier tabla en un schema específico.
   * El nombre de la tabla debe coincidir exactamente con el nombre real
   * en PostgreSQL (ej: "bank_statements").
   *
   * @param tableName Nombre exacto de la tabla en PostgreSQL (snake_case)
   * @param schema Schema de PostgreSQL (opcional, fallback a DbEnvs.dbSchema)
   */
  async getMaxId(tableName: string, schema?: string): Promise<number | null> {
    const schemaName = schema || DbEnvs.dbSchema;

    // Validar contra SQL injection
    this.validateSqlIdentifier(schemaName);
    this.validateSqlIdentifier(tableName);

    const result = await this.dataSource.query(
      `SELECT MAX(id) as "maxId" FROM "${schemaName}"."${tableName}"`,
    );

    return result[0]?.maxId ?? null;
  }

  /**
   * Resetea la secuencia de IDs de una tabla para que el próximo ID
   * sea MAX(id) + 1. Se llama automáticamente después de un rollback.
   *
   * @param tableName Nombre de la tabla
   * @param schema Schema de la tabla
   */
  async resetSequence(tableName: string, schema: string): Promise<void> {
    this.validateSqlIdentifier(schema);
    this.validateSqlIdentifier(tableName);

    const seqName = `${tableName}_id_seq`;

    try {
      const result = await this.dataSource.query(
        `SELECT setval($1, (SELECT COALESCE(MAX(id), 0) FROM "${schema}"."${tableName}"))`,
        [`${schema}.${seqName}`],
      );

      const newSeqValue = result[0]?.setval;
      this.logger.log(`Sequence ${schema}.${seqName} reset to ${newSeqValue}`);
    } catch (error) {
      this.logger.error(`Error resetting sequence ${schema}.${seqName}: ${error.message}`);
      // No lanzar error - el rollback ya fue exitoso
    }
  }

  /**
   * Valida todas las filas contra un DTO de class-validator.
   * @returns null si todas son válidas, o el primer mensaje de error.
   */
  async validateDto<T>(dtoClass: new () => T, rows: any[]): Promise<string | null> {
    for (let i = 0; i < rows.length; i++) {
      const dto = plainToClass(dtoClass, rows[i]);
      const errors = await validate(dto as any);
      if (errors.length > 0) {
        const messages = errors
          .map(e => Object.values(e.constraints || {}).join(', '))
          .filter(Boolean);
        return `Fila ${i + 1}: ${messages.join('; ')}`;
      }
    }
    return null;
  }

  /**
   * Rollback: elimina todas las filas insertadas por una importación.
   * Usa SQL raw porque se almacenó el nombre de la tabla en el tracker.
   * Se puede llamar externamente desde un handler NATS (rollbackImport).
   *
   * Después del rollback exitoso, resetea la secuencia de IDs automáticamente
   * para que el próximo ID sea MAX(id) + 1.
   */
  async rollbackImport(importId: number): Promise<void> {
    const batches = this.batchTracker.get(importId);
    const info = this.importInfo.get(importId);
    if (!batches || batches.length === 0 || !info) {
      this.logger.warn(`Rollback saltado: importId=${importId}, no hay datos para revertir`);
      return;
    }

    const { schema, tableName } = info;
    const totalIds = batches.reduce((sum, b) => sum + b.ids.length, 0);

    this.logger.warn(`=== ROLLBACK INICIADO ===`);
    this.logger.warn(`ImportId: ${importId}`);
    this.logger.warn(`Tabla: ${schema}.${tableName}`);
    this.logger.warn(`Lotes a eliminar: ${batches.length}`);
    this.logger.warn(`Total registros a eliminar: ${totalIds}`);

    // Validar contra SQL injection
    this.validateSqlIdentifier(schema);
    this.validateSqlIdentifier(tableName);

    for (const range of batches) {
      if (range.ids.length === 0) continue;
      // Usar parámetros seguros en vez de interpolación
      const idsPlaceholder = range.ids.map((_, i) => `$${i + 1}`).join(',');
      await this.dataSource.query(
        `DELETE FROM "${schema}"."${tableName}" WHERE id IN (${idsPlaceholder})`,
        range.ids,
      );
    }

    this.batchTracker.delete(importId);
    this.importInfo.delete(importId);

    this.logger.warn(`=== ROLLBACK COMPLETADO ===`);
    this.logger.warn(`Registros eliminados: ${totalIds}`);

    // Reset sequence automáticamente después de rollback exitoso
    await this.resetSequence(tableName, schema);
  }

  /**
   * Inserta un lote de datos en la tabla destino y devuelve los IDs reales
   * asignados por la base de datos (RETURNING id).
   *
   * Si se proporciona un dtoClass, cada fila se valida contra él antes de insertar.
   * Si alguna falla, se eliminan TODOS los lotes anteriores de esta importación
   * (rollback completo) y se lanza un error.
   *
   * Genérico: funciona con cualquier entidad y cualquier DTO.
   *
   * @param repository TypeORM Repository de la entidad destino
   * @param data Arreglo de objetos parciales de la entidad
   * @param isLastBatch Indica si es el último lote de la importación
   * @param importId ID del registro de importación (ImportRecord.id)
   * @param dtoClass Clase DTO opcional para validar cada fila
   */
  async importBatch<T>(
    repository: Repository<T>,
    data: Partial<T>[],
    isLastBatch: boolean,
    importId: number,
    dtoClass?: new () => any,
  ): Promise<BatchResult> {
    // Validar todas las filas contra el DTO antes de insertar
    if (dtoClass && data.length > 0) {
      const error = await this.validateDto(dtoClass, data);
      if (error) {
        // Eliminar todos los lotes anteriores de esta importación
        await this.rollbackImport(importId);
        throw new BadRequestException(
          `Datos inválidos en la importación ${importId}: ${error}`,
        );
      }
    }

    if (data.length === 0) {
      if (isLastBatch) {
        this.batchTracker.delete(importId);
        this.importInfo.delete(importId);
      }
      return { processed: 0, isLastBatch, idStart: null, idEnd: null };
    }

    // Almacenar el schema y nombre real de la tabla la primera vez
    // El schema se obtiene automáticamente del Repository (de la Entity)
    if (!this.importInfo.has(importId)) {
      this.importInfo.set(importId, {
        schema: repository.metadata.schema || 'public',
        tableName: repository.metadata.tableName,
      });
    }

    const result = await repository.createQueryBuilder()
      .insert()
      .values(data as any[])
      .returning('id')
      .execute();

    const ids: number[] = result.raw.map((r: any) => r.id);
    const idStart = Math.min(...ids);
    const idEnd = Math.max(...ids);

    // Registrar los IDs exactos para rollback seguro
    // (NO guardar rango, porque podría borrar IDs insertados manualmente)
    const batches = this.batchTracker.get(importId) || [];
    batches.push({ ids });
    this.batchTracker.set(importId, batches);

    this.logger.log(`Lote insertado: ${data.length} filas (IDs ${idStart}-${idEnd}). ImportId: ${importId}, último: ${isLastBatch}`);

    if (isLastBatch) {
      // Importación completada exitosamente, limpiar tracker
      this.batchTracker.delete(importId);
      this.importInfo.delete(importId);
    }

    return {
      processed: data.length,
      isLastBatch,
      idStart,
      idEnd,
    };
  }
}
