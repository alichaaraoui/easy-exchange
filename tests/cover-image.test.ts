import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { BookCard } from "@/components/book-card";
import { BookCover } from "@/components/book-cover";
import { listAllBooks } from "@/lib/books";
import { resetAndSeed } from "./reset";

describe("FR-022 show the cover or a placeholder", () => {
  it("FR-022-AC1 renders the cover image with alt text for a book with a coverUrl", () => {
    const html = renderToStaticMarkup(
      createElement(BookCover, {
        title: "Delirious New York",
        author: "Rem Koolhaas",
        coverUrl: "https://covers.openlibrary.org/b/isbn/1885254008-L.jpg",
      }),
    );
    expect(html).toContain('src="https://covers.openlibrary.org/b/isbn/1885254008-L.jpg"');
    expect(html).toContain('alt="Cover of Delirious New York by Rem Koolhaas"');
  });

  it("FR-022-AC2 renders the placeholder with title and author and no <img> when coverUrl is null", async () => {
    await resetAndSeed();
    const { books } = await listAllBooks();
    const withoutCover = books.filter((book) => book.coverUrl === null);
    expect(withoutCover.map((book) => book.id)).toEqual(["book_08", "book_12"]);

    for (const book of withoutCover) {
      const html = renderToStaticMarkup(createElement(BookCard, { book }));
      expect(html).not.toContain("<img");
      expect(html).toContain('data-placeholder="cover"');
      expect(html).toContain(`>${book.title}<`);
      expect(html).toContain(`>${book.author}<`);
      expect(html).toContain(`aria-label="Cover of ${book.title} by ${book.author}"`);
    }
  });
});
