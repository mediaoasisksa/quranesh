import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = process.env.DATABASE_URL;

// Enable SSL for Neon cloud URLs, disable for local PostgreSQL
const isNeon = connectionString.includes('neon.tech') ||
               connectionString.includes('neon.database') ||
               connectionString.includes('neondb');

const client = postgres(connectionString, {
  ssl: isNeon ? 'require' : false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

export const db = drizzle(client, { schema });

// Legacy pool-compatible interface — routes.ts uses pool.query() in a few places
export const pool = {
  query: async (text: string, params?: any[]) => {
    const result = await client.unsafe(text, params ?? []);
    return { rows: result };
  },
};
