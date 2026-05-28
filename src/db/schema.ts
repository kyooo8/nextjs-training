import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const ownersTable = sqliteTable("Owners", {
  id: text().primaryKey(),
  name: text().notNull(),
  age: int().notNull(),
  img_url: text(),
  introduction: text(),
  created_at: text(),
});

export const profilesTable = sqliteTable("Profiles", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  img_url: text().notNull(),
  introduction: text().notNull(),
  owner_id: text()
    .references(() => ownersTable.id)
    .notNull(),
  created_at: text().default(sql`(datetime('now', 'localtime'))`),
});

export const viewLogTable = sqliteTable("ViewLog", {
  id: int().primaryKey({ autoIncrement: true }),
  profile_id: int().references(() => profilesTable.id),
  created_at: text(),
});

export const reactionsTable = sqliteTable("Reactions", {
  id: int().primaryKey({ autoIncrement: true }),
  owner_id: text()
    .references(() => ownersTable.id)
    .notNull(),
  profile_id: int()
    .references(() => profilesTable.id)
    .notNull(),
  created_at: text().default(sql`(datetime('now', 'localtime'))`),
});
