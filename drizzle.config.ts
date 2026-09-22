import { defineConfig } from 'drizzle-kit';

const rawUrl = process.env.DATABASE_URL || process.env.TIDB_KONEK;
if (!rawUrl) {
  throw new Error('DATABASE_URL or TIDB_KONEK environment variable is required.');
}

const dbUrl = new URL(rawUrl);

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '4000', 10),
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, ''),
    ssl: { rejectUnauthorized: true },
  },
});
