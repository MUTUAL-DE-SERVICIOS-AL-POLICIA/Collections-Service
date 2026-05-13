import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'collections', name: 'transactions' })
export class TransactionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  total: string;

  @Column({ name: 'payments_type', type: 'varchar', length: 30 })
  paymentsType: string;

  @Column({ type: 'varchar', length: 50 })
  source: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  customer?: string | null;

  @Column({ type: 'varchar', length: 30 })
  state: string;
}
