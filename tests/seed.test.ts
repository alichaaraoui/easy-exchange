import { beforeEach, describe, expect, it } from "vitest";
import { CONDITIONS, writeBook } from "@/lib/books";
import { prisma } from "@/lib/prisma";
import { sortUsers } from "@/lib/session";
import { seedBooks, seedUsers } from "../prisma/seed";
import { resetAndSeed } from "./reset";

beforeEach(async () => {
  await resetAndSeed();
});

describe("FR-001 seed demo data", () => {
  it("FR-001-AC1 seeds exactly the 3 users and 12 books", async () => {
    await prisma.trade.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    const { seed } = await import("../prisma/seed");
    await seed();

    const users = sortUsers(await prisma.user.findMany());
    const books = await prisma.book.findMany({ orderBy: { id: "asc" } });

    expect(users.map((user) => ({ id: user.id, name: user.name }))).toEqual(seedUsers);
    expect(books).toHaveLength(12);
    expect(books.map((book) => book.id)).toEqual(seedBooks.map((book) => book.id));
    expect(books.map((book) => book.title)).toEqual(seedBooks.map((book) => book.title));
  });

  it("FR-001-AC2 gives every book one owner and a real condition", async () => {
    const books = await prisma.book.findMany();
    expect(books).toHaveLength(12);
    for (const book of books) {
      expect(book.ownerId).toBeTruthy();
      expect(CONDITIONS).toContain(book.condition);
    }
    const owners = new Set(books.map((book) => book.ownerId));
    expect(owners).toEqual(new Set(["user_maya", "user_jordan", "user_sam"]));
  });

  it("FR-001-AC3 rejects a condition outside the five grades", async () => {
    const before = await prisma.book.count();
    const result = await writeBook({
      id: "book_bad",
      title: "Not a real grade",
      author: "Test",
      isbn: "000",
      category: "DESIGN",
      publisher: "Test",
      year: 2000,
      condition: "USED",
      jacketCondition: "NONE",
      ownerId: "user_maya",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(400);
    expect(await prisma.book.count()).toBe(before);
    expect(await prisma.book.findUnique({ where: { id: "book_bad" } })).toBeNull();
  });
});
