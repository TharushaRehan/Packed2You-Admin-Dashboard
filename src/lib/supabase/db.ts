import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("Cannot find database url.");
}

//
const client = postgres(process.env.DATABASE_URL as string, { max: 1 });
const db = drizzle(client, { schema });
const migrateDB = async () => {
  try {
    console.log("Migrating client");
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Successfully Migrated");
  } catch (err) {
    console.log(err);
  }
};

if (process.env.NODE_ENV !== "production") {
  migrateDB();
}

export default db;
