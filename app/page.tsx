import { BookCard } from "@/components/book-card";
import { BrowseFilters } from "@/components/browse-filters";
import { parseBrowseParams, searchBooks } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseBrowseParams(await searchParams);
  const result = await searchBooks(query);
  const books = result.ok ? result.books : [];
  const filtered = Boolean(query.q?.trim() || query.category || query.condition || query.outOfPrint);
  const anyListed = filtered ? (await prisma.book.count()) > 0 : books.length > 0;

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Browse</h1>
      <p className="mt-2 text-stone-700">
        Architecture and art books, one for one. No money changes hands.
      </p>

      <BrowseFilters query={query} />

      {!result.ok ? (
        <p role="alert" className="mt-6 text-stone-800">
          {result.message}{" "}
          <a href="/" className="underline underline-offset-4">
            Clear
          </a>
        </p>
      ) : !anyListed ? (
        <p className="mt-6 text-stone-700">No books are listed yet.</p>
      ) : books.length === 0 ? (
        <p className="mt-6 text-stone-700">
          No books match these filters.{" "}
          <a href="/" className="underline underline-offset-4">
            Clear
          </a>
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-stone-700">
            {books.length === 1 ? "1 book" : `${books.length} books`}
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <li key={book.id}>
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
