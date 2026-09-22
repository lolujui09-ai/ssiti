import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@/drizzle/schema';

// TiDB Cloud uses mysql2 with SSL
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL || process.env.TIDB_KONEK,
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
});

export const db = drizzle(connection, { schema, mode: 'default' });

