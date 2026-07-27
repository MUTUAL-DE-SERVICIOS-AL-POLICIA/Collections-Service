import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  schema: 'collections',
  name: 'transactions',
})
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'paymentDate',
    type: 'varchar',
  })
  paymentDate: string;

  @Column({
    name: 'titularName',
    type: 'varchar',
    length: 255,
  })
  titularName: string;

  @Column({
    name: 'payerName',
    type: 'varchar',
    length: 255,
  })
  payerName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  origin: string;

  @Column({
    name: 'accountNumber',
    type: 'varchar',
    length: 255,
  })
  accountNumber: string;

  @Column({
    name: 'paymentType',
    type: 'varchar',
    length: 100,
  })
  paymentType: string;

  @Column({
    name: 'receptionistUser',
    type: 'varchar',
    length: 100,
  })
  receptionistUser: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({
    type: 'varchar',
  })
  state: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;
}
