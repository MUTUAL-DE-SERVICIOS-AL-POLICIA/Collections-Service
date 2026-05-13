import 'dotenv/config';
import { Client } from 'pg';
import { DbEnvs } from 'src/config';

function getSchemaName(): string {
  const schema = DbEnvs.dbSchema;

  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) {
    throw new Error(`Invalid schema name: ${schema}`);
  }

  return schema;
}

async function ensureSchema(): Promise<void> {
  const client = new Client({
    host: DbEnvs.dbHost,
    port: DbEnvs.dbPort,
    database: DbEnvs.dbDatabase,
    user: DbEnvs.dbUsername,
    password: DbEnvs.dbPassword,
  });

  const schema = getSchemaName();

  await client.connect();

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  } finally {
    await client.end();
  }
}

ensureSchema().catch((error) => {
  console.error(error);
  process.exit(1);
});
