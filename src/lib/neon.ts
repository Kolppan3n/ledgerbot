import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Check your .env.local or Vercel environment variables.",
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = pool;
