import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import BookNotFound from "@/app/books/[id]/not-found";
import { BookCard } from "@/components/book-card";
import { BookDetails } from "@/components/book-details";
import { getBook } from "@/lib/books";
import { resetAndSeed } from "./reset";

beforeAll(async () => {
  await resetAndSeed();
});

describe("FR-025 book detail", () => {
  it("FR-025-AC1 shows the cover and every field, including the owner's name", async () => {
    const result = await getBook("book_08");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const html = renderToStaticMarkup(createElement(BookDetails, { book: result.book }));

    expect(html).toContain('data-placeholder="cover"');
    const expected: [string, string][] = [
      ["ISBN", "0262220156"],
      ["Category", "Architectural Theory"],
      ["Publisher", "MIT Press"],
      ["Year", "1972"],
      ["Edition", "1st ed."],
      ["Out of print", "Yes"],
      ["Condition", "Fair"],
      ["Jacket condition", "Poor"],
      ["Owner", "Jordan Hale"],
    ];
    for (const [term, value] of expected) {
      expect(html).toContain(`<dt class="font-medium text-stone-600">${term}</dt><dd>${value}</dd>`);
    }
    expect(html).toContain(">Learning from Las Vegas</h1>");
    expect(html).toContain("Robert Venturi, Denise Scott Brown, Steven Izenour");

    const withCover = await getBook("book_01");
    if (!withCover.ok) throw new Error("book_01 missing");
    const coverHtml = renderToStaticMarkup(createElement(BookDetails, { book: withCover.book }));
    expect(coverHtml).toContain('alt="Cover of Toward an Architecture by Le Corbusier"');
    expect(coverHtml).toContain("<dt class=\"font-medium text-stone-600\">Edition</dt><dd>—</dd>");
    expect(coverHtml).toContain("<dt class=\"font-medium text-stone-600\">Out of print</dt><dd>No</dd>");

    const card = renderToStaticMarkup(createElement(BookCard, { book: withCover.book }));
    expect(card).toContain('href="/books/book_01"');
  });

  it("FR-025-AC2 an unknown id is 404 with \"That book is not listed.\"", async () => {
    expect(await getBook("book_missing")).toEqual({
      ok: false,
      status: 404,
      message: "That book is not listed.",
    });
    const html = renderToStaticMarkup(createElement(BookNotFound));
    expect(html).toContain("That book is not listed.");
    expect(html).toContain('href="/"');
  });
});
