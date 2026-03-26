import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// HTTP-based driver: each query is a fresh HTTP request that auto-wakes
// the Neon compute if it has auto-suspended. More reliable than the
// WebSocket Pool for long-running Node.js servers.
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Legacy export — routes.ts uses pool.query() in a few places;
// this stub keeps them compiling while we migrate.
export const pool = {
  query: async (text: string, params?: any[]) => {
    const result = await sql(text, params ?? []);
    return { rows: result };
  },
};
