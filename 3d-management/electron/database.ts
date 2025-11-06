import { app } from 'electron';
import knex, { Knex } from 'knex';
import path from 'path';
import fs from 'fs';

let db: Knex | null = null;

export function initDatabase(): Knex {
  if (db) return db;

  const isDev = process.env.NODE_ENV === 'development';
  const userDataPath = app.getPath('userData');
  const dbDir = isDev ? path.join(process.cwd(), 'data') : userDataPath;

  // Ensure directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, '3d-management.sqlite');

  db = knex({
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
  });

  console.log(`Database initialized at: ${dbPath}`);
  return db;
}

export function getDatabase(): Knex {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
  }
}
