// src/bank-statement/entities/bank-statement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ConciliationState {
  CONCILIADO = 'CONCILIADO',
  NO_CONCILIADO = 'NO_CONCILIADO',
}

@Entity({ schema: 'collections', name: 'bank_statements' })
export class BankStatement {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'operation_code', length: 50 })
  operationCode: string;

  @Column({ name: 'document_number', type: 'bigint' })
  documentNumber: number;

  @Column({ type: 'varchar', length: 255 })
  gloss: string;

  @Column({ name: 'transferred_account', length: 100, nullable: true })
  transferredAccount: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  credits: number;

  @Column({ type: 'enum', enum: ConciliationState, default: ConciliationState.NO_CONCILIADO })
  state: ConciliationState;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}