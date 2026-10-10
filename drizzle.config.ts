import { defineConfig } from "drizzle-kit";
import { loadEnv } from "./scripts/load-env";

loadEnv();

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
