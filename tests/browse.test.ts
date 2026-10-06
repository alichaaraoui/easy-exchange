import { beforeAll, describe, expect, it } from "vitest";
import { searchBooks, type BrowseQuery } from "@/lib/books";
import { resetAndSeed } from "./reset";

beforeAll(async () => {
  await resetAndSeed();
});

async function ids(query: BrowseQuery) {
  const result = await searchBooks(query);
  if (!result.ok) throw new Error(`expected ok, got ${result.status}`);
  return result.books.map((book) => book.id);
}

describe("FR-023 search by title or author", () => {
  it("FR-023-AC1 koolhaas matches exactly book_05 and book_06", async () => {
    expect(await ids({ q: "koolhaas" })).toEqual(["book_05", "book_06"]);
  });

  it("FR-023-AC2 mixed case wAyS oF sEeInG matches only book_03", async () => {
    expect(await ids({ q: "wAyS oF sEeInG" })).toEqual(["book_03"]);
  });

  it("FR-023-AC3 zzzz-no-match returns an empty list", async () => {
    expect(await ids({ q: "zzzz-no-match" })).toEqual([]);
  });

  it("FR-023-AC4 a query of only spaces returns all 12 books", async () => {
    expect(await ids({ q: "   " })).toHaveLength(12);
  });
});
