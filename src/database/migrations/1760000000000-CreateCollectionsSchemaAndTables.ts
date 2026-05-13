import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';

export class CreateCollectionsSchemaAndTables1760000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('collections', true);

    await queryRunner.createTable(
      new Table({
        schema: 'collections',
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'total',
            type: 'numeric',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'payments_type',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
          {
            name: 'source',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'customer',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'collections.transactions',
      new TableIndex({
        name: 'idx_transactions_code',
        columnNames: ['code'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'collections.transactions',
      new TableIndex({
        name: 'idx_transactions_date',
        columnNames: ['date'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        schema: 'collections',
        name: 'bank_statement',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'operation_code',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'document_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'gloss',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'transferred_account',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'credits',
            type: 'numeric',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '30',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'collections.bank_statement',
      new TableIndex({
        name: 'idx_bank_statement_operation_code',
        columnNames: ['operation_code'],
      }),
    );

    await queryRunner.createIndex(
      'collections.bank_statement',
      new TableIndex({
        name: 'idx_bank_statement_date',
        columnNames: ['date'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('collections.bank_statement', true);
    await queryRunner.dropTable('collections.transactions', true);
  }
}
