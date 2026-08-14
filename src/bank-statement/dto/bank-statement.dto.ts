// src/bank-statement/dto/bank-statement.dto.ts
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ConciliationState } from '../entities/bank-statement.entity';

export class CreateBankStatementDto {
  @IsDateString()
  date: string;

  @Transform(({ value }) => String(value ?? ''))
  @IsString()
  operationCode: string;

  @Transform(({ value }) => value != null ? Number(value) : undefined)
  @IsNumber()
  documentNumber: number;

  @Transform(({ value }) => String(value ?? ''))
  @IsString()
  gloss: string;

  @IsOptional()
  @Transform(({ value }) => value != null ? String(value) : undefined)
  @IsString()
  transferredAccount?: string;

  @Transform(({ value }) => value != null ? Number(value) : undefined)
  @IsNumber()
  credits: number;

  @IsOptional()
  @IsEnum(ConciliationState)
  state?: ConciliationState;
}

// DTO para recibir el lote desde el Gateway vía NATS
export class ImportBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBankStatementDto)
  data: CreateBankStatementDto[];

  @IsBoolean()
  isLastBatch: boolean;

  @IsOptional()
  @IsNumber()
  importId?: number;
}

export class UpdateBankStatementDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  operationCode?: string;

  @IsOptional()
  @IsNumber()
  documentNumber?: number;

  @IsOptional()
  @IsString()
  gloss?: string;

  @IsOptional()
  @IsString()
  transferredAccount?: string;

  @IsOptional()
  @IsNumber()
  credits?: number;

  @IsOptional()
  @IsEnum(ConciliationState)
  state?: ConciliationState;
}