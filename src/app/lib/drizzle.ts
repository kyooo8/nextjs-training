import "dotenv/config";
import path from "path";
import { drizzle } from "drizzle-orm/better-sqlite3";

const dbPath = path.resolve(process.cwd(), process.env.DB_FILE_NAME!);
export const db = drizzle(dbPath);
