import { beforeEach, describe, expect, it } from "vitest";
import { createBook, updateBook } from "@/lib/books";
import { prisma } from "@/lib/prisma";
import { resetAndSeed } from "./reset";

const input = {
  title: "The Architecture of the City",
  author: "Aldo Rossi",
  isbn: "0262680432",
  category: "ARCHITECTURAL_THEORY",
  publisher: "MIT Press",
  year: "1984",
  edition: "",
  outOfPrint: false,
  condition: "GOOD",
  jacketCondition: "FAIR",
};

const book01 = {
  title: "Toward an Architecture",
  author: "Le Corbusier",
  isbn: "0892368225",
  category: "ARCHITECTURAL_THEORY",
  publisher: "Getty Research Institute",
  year: 2007,
  edition: "",
  outOfPrint: false,
  condition: "GOOD",
  jacketCondition: "NONE",
};

beforeEach(async () => {
  await resetAndSeed();
});

async function expectNothingWritten(run: () => Promise<unknown>) {
  const before = await prisma.book.count();
  const result = await run();
  expect(result).toMatchObject({ ok: false, status: 400 });
  expect(await prisma.book.count()).toBe(before);
}

describe("FR-017 category", () => {
  it("FR-017-AC1 stores EXHIBITION_CATALOGUE", async () => {
    const result = await createBook("user_maya", { ...input, category: "EXHIBITION_CATALOGUE" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored?.category).toBe("EXHIBITION_CATALOGUE");
  });

  it("FR-017-AC2 rejects FICTION on add and on edit", async () => {
    await expectNothingWritten(() => createBook("user_maya", { ...input, category: "FICTION" }));
    const result = await updateBook("user_maya", "book_01", { ...book01, category: "FICTION" });
    expect(result).toMatchObject({ ok: false, status: 400 });
    const stored = await prisma.book.findUnique({ where: { id: "book_01" } });
    expect(stored?.category).toBe("ARCHITECTURAL_THEORY");
  });

  it("FR-017-AC3 rejects a missing category", async () => {
    await expectNothingWritten(() => createBook("user_maya", { ...input, category: "" }));
  });
});

describe("FR-018 publisher, year, edition, out of print", () => {
  it("FR-018-AC1 stores publisher, year, edition, and out of print", async () => {
    const result = await createBook("user_maya", {
      ...input,
      publisher: "MIT Press",
      year: "1972",
      edition: "1st ed.",
      outOfPrint: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored).toMatchObject({ publisher: "MIT Press", year: 1972, edition: "1st ed.", outOfPrint: true });
  });

  it("FR-018-AC2 stores a blank edition as empty and out of print as false", async () => {
    const result = await createBook("user_maya", { ...input, edition: "   ", outOfPrint: undefined });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored).toMatchObject({ edition: "", outOfPrint: false });
  });

  it("FR-018-AC3 rejects a blank publisher", async () => {
    await expectNothingWritten(() => createBook("user_maya", { ...input, publisher: "  " }));
  });

  it("FR-018-AC4 rejects year 1449, next year, and a non-whole number", async () => {
    const nextYear = new Date().getFullYear() + 1;
    for (const year of ["1449", String(nextYear), "1984.5", "nineteen", ""]) {
      await expectNothingWritten(() => createBook("user_maya", { ...input, year }));
    }
  });
});

describe("FR-019 jacket condition", () => {
  it("FR-019-AC1 stores jacket condition NONE", async () => {
    const result = await createBook("user_maya", { ...input, jacketCondition: "NONE" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored?.jacketCondition).toBe("NONE");
  });

  it("FR-019-AC2 rejects MINT on edit and keeps the stored jacket condition", async () => {
    const result = await updateBook("user_maya", "book_01", { ...book01, jacketCondition: "MINT" });
    expect(result).toMatchObject({ ok: false, status: 400 });
    const stored = await prisma.book.findUnique({ where: { id: "book_01" } });
    expect(stored?.jacketCondition).toBe("NONE");
  });
});
