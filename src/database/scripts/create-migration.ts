import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const migrationPath = args[0];

if (!migrationPath) {
  console.error(
    'You must provide a migration path. Example: pnpm run migration:create -- src/database/migrations/CreateExampleMigration',
  );
  process.exit(1);
}

const cliPath = resolve(process.cwd(), 'node_modules/typeorm/cli.js');
const result = spawnSync(
  process.execPath,
  [cliPath, 'migration:create', migrationPath],
  {
    stdio: 'inherit',
  },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
