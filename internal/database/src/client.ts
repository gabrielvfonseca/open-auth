import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "./generated/prisma/client";
import { keys } from "./keys";

const { Pool } = pg;

const POOL_MAX_CONNECTIONS = 20;
const POOL_IDLE_TIMEOUT = 10_000;
const POOL_MAX_USES = 1000;

// Declare the global for the database client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize Prisma adapter using the connection pool config
const pool = new Pool({
  connectionString: keys().DATABASE_URL,
  max: POOL_MAX_CONNECTIONS,
  idleTimeoutMillis: POOL_IDLE_TIMEOUT,
  maxUses: POOL_MAX_USES,
});

const adapter = new PrismaPg(pool);

// Declare the database client
export const database =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (keys().NODE_ENV === "production") {
  globalForPrisma.prisma = database;
}
