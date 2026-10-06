import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const TEST_DATABASE_NAME = "easy_exchange_test";

export default async function setup() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("TEST_DATABASE_URL is not set.");

  const db = new PrismaClient({ datasourceUrl: url });
  try {
    const [row] = await db.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
    if (row?.name !== TEST_DATABASE_NAME) {
      throw new Error(`Refusing to reset "${row?.name}": tests only reset ${TEST_DATABASE_NAME}.`);
    }
    await db.$executeRawUnsafe("DROP SCHEMA IF EXISTS public CASCADE");
    await db.$executeRawUnsafe("CREATE SCHEMA public");
  } finally {
    await db.$disconnect();
  }

  execSync("npx prisma migrate deploy", {
    stdio: "pipe",
    env: { ...process.env, DATABASE_URL: url, DATABASE_URL_UNPOOLED: url },
  });
}
