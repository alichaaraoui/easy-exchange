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

const expectedCatalog = [
  ["book_01", "user_maya", "Toward an Architecture", "ARCHITECTURAL_THEORY", "Getty Research Institute", 2007, "", false, "GOOD", "NONE"],
  ["book_02", "user_maya", "Thinking with Type", "DESIGN", "Princeton Architectural Press", 2010, "2nd rev. ed.", false, "LIKE_NEW", "NONE"],
  ["book_03", "user_maya", "Ways of Seeing", "ART_HISTORY", "Penguin", 1990, "", false, "FAIR", "NONE"],
  ["book_04", "user_maya", "On Photography", "PHOTOGRAPHY", "Picador", 2001, "", false, "GOOD", "NONE"],
  ["book_05", "user_jordan", "S, M, L, XL", "ARCHITECTURE_MONOGRAPH", "Monacelli Press", 1995, "1st ed.", false, "GOOD", "NONE"],
  ["book_06", "user_jordan", "Delirious New York", "ARCHITECTURAL_THEORY", "Monacelli Press", 1994, "New ed.", false, "LIKE_NEW", "GOOD"],
  ["book_07", "user_jordan", "Deconstructivist Architecture", "EXHIBITION_CATALOGUE", "Museum of Modern Art", 1988, "1st ed.", true, "GOOD", "NONE"],
  ["book_08", "user_jordan", "Learning from Las Vegas", "ARCHITECTURAL_THEORY", "MIT Press", 1972, "1st ed.", true, "FAIR", "POOR"],
  ["book_09", "user_sam", "The Story of Art", "ART_HISTORY", "Phaidon", 1995, "16th ed.", false, "GOOD", "GOOD"],
  ["book_10", "user_sam", "Uncommon Places", "PHOTOGRAPHY", "Aperture", 2005, "Revised ed.", false, "NEW", "FINE"],
  ["book_11", "user_sam", "Grid Systems in Graphic Design", "DESIGN", "Niggli", 1996, "4th rev. ed.", false, "LIKE_NEW", "NONE"],
  ["book_12", "user_sam", "Twentysix Gasoline Stations", "ARTIST_BOOK_ZINE", "Printed Matter", 2009, "", false, "POOR", "NONE"],
] as const;

const expectedIsbns: Record<string, string> = {
  book_01: "0892368225", book_02: "1568989695", book_03: "0140135154", book_04: "0312420099",
  book_05: "1885254016", book_06: "1885254008", book_07: "087070298X", book_08: "0262220156",
  book_09: "0714832472", book_10: "1931788340", book_11: "3721201450", book_12: "0894390449",
};

describe("FR-020 seed the art and architecture catalog", () => {
  it("FR-020-AC1 seeds every book with the fields in data-model.md", async () => {
    const books = await prisma.book.findMany({ orderBy: { id: "asc" } });
    expect(
      books.map((b) => [b.id, b.ownerId, b.title, b.category, b.publisher, b.year, b.edition, b.outOfPrint, b.condition, b.jacketCondition]),
    ).toEqual(expectedCatalog);
    for (const book of books) expect(book.isbn).toBe(expectedIsbns[book.id]);
    expect(books.find((b) => b.id === "book_08")?.author).toBe(
      "Robert Venturi, Denise Scott Brown, Steven Izenour",
    );
  });

  it("FR-020-AC2 leaves book_08 and book_12 without a cover and gives the rest their Open Library URL", async () => {
    const books = await prisma.book.findMany({ orderBy: { id: "asc" } });
    for (const book of books) {
      if (book.id === "book_08" || book.id === "book_12") {
        expect(book.coverUrl).toBeNull();
      } else {
        expect(book.coverUrl).toBe(`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`);
      }
    }
  });

  it("FR-020-AC3 running the seed again still leaves 12 books and 3 users", async () => {
    const { seed } = await import("../prisma/seed");
    await seed();
    expect(await prisma.book.count()).toBe(12);
    expect(await prisma.user.count()).toBe(3);
  });

  it("FR-020-AC4 rejects a category outside the seven", async () => {
    const before = await prisma.book.count();
    const result = await writeBook({
      id: "book_bad_category",
      title: "Not a category",
      author: "Test",
      isbn: "000",
      category: "FICTION",
      publisher: "Test",
      year: 2000,
      condition: "GOOD",
      jacketCondition: "NONE",
      ownerId: "user_maya",
    });
    expect(result).toMatchObject({ ok: false, status: 400 });
    expect(await prisma.book.count()).toBe(before);
  });
});
