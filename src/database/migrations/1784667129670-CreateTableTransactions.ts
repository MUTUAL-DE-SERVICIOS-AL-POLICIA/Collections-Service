import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTransactions1784667129670 implements MigrationInterface {
  name = 'CreateTableTransactions1784667129670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('collections', true);

    await queryRunner.createTable(
      new Table({
        schema: 'collections',
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'paymentDate',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'titularName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'payerName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'origin',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'accountNumber',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'paymentType',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'receptionistUser',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('collections.transactions', true);
  }
}
