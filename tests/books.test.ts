import { beforeEach, describe, expect, it } from "vitest";
import { createBook, deleteBook, listAllBooks, listMyBooks, updateBook } from "@/lib/books";
import { prisma } from "@/lib/prisma";
import { resetAndSeed } from "./reset";

const mayaBook = {
  title: "Domain-Driven Design",
  author: "Eric Evans",
  isbn: "9780321125217",
  condition: "GOOD",
  genre: "Software",
};

beforeEach(async () => {
  await resetAndSeed();
});

describe("FR-003 add a book I own", () => {
  it("FR-003-AC1 stores the book with the actor as the only owner", async () => {
    const result = await createBook("user_maya", { ...mayaBook, ownerId: "user_sam" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.book.ownerId).toBe("user_maya");
    expect(result.book.title).toBe("Domain-Driven Design");
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored?.ownerId).toBe("user_maya");
  });

  it("FR-003-AC2 rejects a blank title and writes nothing", async () => {
    const before = await prisma.book.count();
    const result = await createBook("user_maya", { ...mayaBook, title: "   " });
    expect(result).toMatchObject({ ok: false, status: 400 });
    expect(await prisma.book.count()).toBe(before);
  });

  it("FR-003-AC3 rejects condition USED and writes nothing", async () => {
    const before = await prisma.book.count();
    const result = await createBook("user_maya", { ...mayaBook, condition: "USED" });
    expect(result).toMatchObject({ ok: false, status: 400 });
    expect(await prisma.book.count()).toBe(before);
  });
});

describe("FR-004 edit a book I own", () => {
  it("FR-004-AC1 changes the title and keeps the owner", async () => {
    const result = await updateBook("user_maya", "book_01", {
      title: "Cleaner Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      condition: "GOOD",
      genre: "Software",
      ownerId: "user_sam",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.book.title).toBe("Cleaner Code");
    expect(result.book.ownerId).toBe("user_maya");
  });

  it("FR-004-AC2 rejects an edit from someone who does not own the book", async () => {
    const result = await updateBook("user_jordan", "book_01", {
      title: "Taken",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      condition: "GOOD",
      genre: "Software",
    });
    expect(result).toMatchObject({ ok: false, status: 403 });
    const stored = await prisma.book.findUnique({ where: { id: "book_01" } });
    expect(stored?.title).toBe("Clean Code");
  });

  it("FR-004-AC3 returns 404 when the book does not exist", async () => {
    const result = await updateBook("user_maya", "book_missing", {
      ...mayaBook,
    });
    expect(result).toMatchObject({ ok: false, status: 404 });
  });

  it("FR-004-AC4 rejects USED and leaves the condition unchanged", async () => {
    const result = await updateBook("user_maya", "book_01", {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      condition: "USED",
      genre: "Software",
    });
    expect(result).toMatchObject({ ok: false, status: 400 });
    const stored = await prisma.book.findUnique({ where: { id: "book_01" } });
    expect(stored?.condition).toBe("GOOD");
  });
});

describe("FR-005 delete a book I own", () => {
  it("FR-005-AC1 deletes a book the actor owns", async () => {
    const result = await deleteBook("user_maya", "book_01");
    expect(result).toEqual({ ok: true });
    expect(await prisma.book.findUnique({ where: { id: "book_01" } })).toBeNull();
  });

  it("FR-005-AC2 rejects a delete from someone who does not own the book", async () => {
    const result = await deleteBook("user_jordan", "book_01");
    expect(result).toMatchObject({ ok: false, status: 403 });
    expect(await prisma.book.findUnique({ where: { id: "book_01" } })).not.toBeNull();
  });

  it("FR-005-AC3 returns 404 when the book does not exist", async () => {
    const result = await deleteBook("user_maya", "book_missing");
    expect(result).toMatchObject({ ok: false, status: 404 });
  });
});

describe("FR-006 view my shelf", () => {
  it("FR-006-AC1 lists only Maya's four books", async () => {
    const { books } = await listMyBooks("user_maya");
    expect(books.map((book) => book.id)).toEqual(["book_01", "book_02", "book_03", "book_04"]);
    expect(books.some((book) => book.ownerId === "user_jordan" || book.ownerId === "user_sam")).toBe(
      false,
    );
  });

  it("FR-006-AC2 returns an empty list when the user owns nothing", async () => {
    await prisma.book.deleteMany({ where: { ownerId: "user_maya" } });
    const { books } = await listMyBooks("user_maya");
    expect(books).toEqual([]);
  });
});

describe("FR-007 list every book", () => {
  it("FR-007-AC1 returns all 12 books, including ones the viewer does not own", async () => {
    const { books } = await listAllBooks();
    expect(books).toHaveLength(12);
    expect(books.some((book) => book.ownerId !== "user_maya")).toBe(true);
    expect(books.map((book) => book.id)).toEqual([
      "book_01",
      "book_02",
      "book_03",
      "book_04",
      "book_05",
      "book_06",
      "book_07",
      "book_08",
      "book_09",
      "book_10",
      "book_11",
      "book_12",
    ]);
  });

  it("FR-007-AC2 returns an empty list when nothing is listed", async () => {
    await prisma.book.deleteMany();
    const { books } = await listAllBooks();
    expect(books).toEqual([]);
  });
});
