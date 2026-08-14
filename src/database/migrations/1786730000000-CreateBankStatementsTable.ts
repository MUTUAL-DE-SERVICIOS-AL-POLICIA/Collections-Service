import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBankStatementsTable1786730000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear enum para state
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE collections.bank_statements_state_enum AS ENUM ('CONCILIADO', 'NO_CONCILIADO');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.createTable(
      new Table({
        name: 'bank_statements',
        schema: 'collections',
        columns: [
          {
            name: 'id',
            type: 'int',
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
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'gloss',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'transferred_account',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'credits',
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
          },
          {
            name: 'state',
            type: 'enum',
            enumName: 'bank_statements_state_enum',
            enum: ['CONCILIADO', 'NO_CONCILIADO'],
            default: "'NO_CONCILIADO'",
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS collections.bank_statements');
    await queryRunner.query('DROP TYPE IF EXISTS collections.bank_statements_state_enum');
  }
}
