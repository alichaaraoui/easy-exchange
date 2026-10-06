import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe("NFR-001 tests run on a separate Postgres test database", () => {
  it("connects to Postgres through TEST_DATABASE_URL, not DATABASE_URL", async () => {
    expect(process.env.DATABASE_URL).toBe(process.env.TEST_DATABASE_URL);
    const [row] = await prisma.$queryRaw<{ db: string; version: string }[]>`
      SELECT current_database() AS db, version() AS version
    `;
    expect(row.version).toMatch(/^PostgreSQL/);
    expect(row.db).toBe("easy_exchange_test");
  });
});
