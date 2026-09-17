import { readFile, readdir } from 'node:fs/promises';
import { Pool } from 'pg';

let pool;
export function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10, ssl: process.env.DATABASE_SSL === 'require' ? { rejectUnauthorized: true } : undefined });
  return pool;
}

export async function migrate() {
  const db = database();
  await db.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at bigint NOT NULL)');
  const root = new URL('./postgres/', import.meta.url);
  for (const name of (await readdir(root)).filter(x => x.endsWith('.sql')).sort()) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const exists = await client.query('SELECT 1 FROM schema_migrations WHERE name=$1', [name]);
      if (!exists.rowCount) {
        await client.query(await readFile(new URL(name, root), 'utf8'));
        await client.query('INSERT INTO schema_migrations (name, applied_at) VALUES ($1, $2)', [name, Date.now()]);
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }
}
