import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

let _db: BetterSQLite3Database<typeof schema> | null = null;

function resolveDbPath(): string {
  // Use SQLITE_URL to avoid collision with global DATABASE_URL (e.g. postgres in containers)
  const envUrl = process.env.SQLITE_URL || process.env.TODO_DB_PATH;
  if (envUrl) {
    const cleaned = envUrl.replace("file:", "");
    if (!path.isAbsolute(cleaned)) {
      return path.resolve(process.cwd(), cleaned);
    }
    return cleaned;
  }
  return path.resolve(process.cwd(), "todos.db");
}

export function getDb() {
  if (!_db) {
    const dbPath = resolveDbPath();
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT NOT NULL DEFAULT 'medium',
        due_date TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});
