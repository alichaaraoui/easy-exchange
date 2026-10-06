import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { BrowseFilters } from "@/components/browse-filters";
import { parseBrowseParams, searchBooks, type BrowseQuery } from "@/lib/books";
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

describe("FR-024 filter by category, condition, and out of print", () => {
  it("FR-024-AC1 category PHOTOGRAPHY returns exactly book_04 and book_10", async () => {
    expect(await ids({ category: "PHOTOGRAPHY" })).toEqual(["book_04", "book_10"]);
  });

  it("FR-024-AC2 condition FAIR returns exactly book_03 and book_08", async () => {
    expect(await ids({ condition: "FAIR" })).toEqual(["book_03", "book_08"]);
  });

  it("FR-024-AC3 out of print only returns exactly book_07 and book_08", async () => {
    expect(await ids({ outOfPrint: true })).toEqual(["book_07", "book_08"]);
  });

  it("FR-024-AC4 search koolhaas with category ARCHITECTURAL_THEORY returns only book_06", async () => {
    expect(await ids({ q: "koolhaas", category: "ARCHITECTURAL_THEORY" })).toEqual(["book_06"]);
  });

  it("FR-024-AC5 ARCHITECTURAL_THEORY, FAIR, and out of print together return only book_08", async () => {
    expect(
      await ids({ category: "ARCHITECTURAL_THEORY", condition: "FAIR", outOfPrint: true }),
    ).toEqual(["book_08"]);
  });

  it("FR-024-AC6 an unknown category or condition is 400", async () => {
    expect(await searchBooks({ category: "FICTION" })).toMatchObject({ ok: false, status: 400 });
    expect(await searchBooks({ condition: "USED" })).toMatchObject({ ok: false, status: 400 });
  });

  it("FR-024-AC7 the URL drives the filter form and the results", async () => {
    const query = parseBrowseParams({ q: "koolhaas", category: "ARCHITECTURAL_THEORY", oop: "1" });
    expect(query).toEqual({ q: "koolhaas", category: "ARCHITECTURAL_THEORY", condition: "", outOfPrint: true });

    const html = renderToStaticMarkup(createElement(BrowseFilters, { query }));
    expect(html).toMatch(/id="browse-q"[^>]*value="koolhaas"/);
    expect(html).toContain('value="ARCHITECTURAL_THEORY" selected=""');
    expect(html).toMatch(/id="browse-oop"[^>]*checked=""/);
    for (const id of ["browse-q", "browse-category", "browse-condition", "browse-oop"]) {
      expect(html).toContain(`for="${id}"`);
    }

    expect(await ids(query)).toEqual([]);
    expect(await ids({ ...query, outOfPrint: false })).toEqual(["book_06"]);
  });
});
