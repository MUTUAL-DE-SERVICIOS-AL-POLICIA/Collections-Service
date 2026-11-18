// src/bank-statement/dto/bank-statement.dto.ts
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ConciliationState } from '../entities/bank-statement.entity';

export class CreateBankStatementDto {
  @IsDateString()
  date: Date;

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