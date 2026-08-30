import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const ecosystemComponents = mysqlTable("ecosystem_components", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  role: text("role").notNull(),
  status: mysqlEnum("status", ["VERIFIED", "PREPARED", "ROADMAP", "NOT_VERIFIED"]).notNull(),
  repositoryUrl: varchar("repositoryUrl", { length: 500 }),
  surfaceUrl: varchar("surfaceUrl", { length: 500 }),
  boundary: text("boundary").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const evidenceRecords = mysqlTable("evidence_records", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  kind: varchar("kind", { length: 60 }).notNull(),
  status: mysqlEnum("status", ["VERIFIED", "PREPARED", "ROADMAP", "NOT_VERIFIED"]).notNull(),
  summary: text("summary").notNull(),
  commitSha: varchar("commitSha", { length: 80 }),
  checksum: varchar("checksum", { length: 128 }),
  releaseTag: varchar("releaseTag", { length: 80 }),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  artifactUrl: varchar("artifactUrl", { length: 500 }),
  observedAt: timestamp("observedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type EcosystemComponent = typeof ecosystemComponents.$inferSelect;
export type EvidenceRecord = typeof evidenceRecords.$inferSelect;
