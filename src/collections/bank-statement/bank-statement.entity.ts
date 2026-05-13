import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'collections', name: 'bank_statement' })
export class BankStatementEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'operation_code', type: 'varchar', length: 50 })
  operationCode: string;

  @Column({ name: 'document_number', type: 'varchar', length: 50, nullable: true })
  documentNumber?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gloss?: string | null;

  @Column({
    name: 'transferred_account',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  transferredAccount?: string | null;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  credits: string;

  @Column({ type: 'varchar', length: 30 })
  state: string;
}
