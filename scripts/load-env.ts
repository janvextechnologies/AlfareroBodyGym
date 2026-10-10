import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Carga variables desde .env.local y .env sin depender de dotenv.
 * Solo asigna variables que aún no existen en process.env.
 */
export function loadEnv(files: string[] = [".env.local", ".env"]) {
  for (const file of files) {
    const filePath = resolve(process.cwd(), file);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const eq = line.indexOf("=");
      if (eq === -1) continue;

      const key = line.slice(0, eq).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;

      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}
