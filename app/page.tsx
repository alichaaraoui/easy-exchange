import { BookCard } from "@/components/book-card";
import { searchBooks } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const result = await searchBooks({ q });
  const books = result.ok ? result.books : [];
  const filtered = q.trim() !== "";
  const anyListed = filtered ? (await prisma.book.count()) > 0 : books.length > 0;

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Browse</h1>
      <p className="mt-2 text-stone-700">
        Architecture and art books, one for one. No money changes hands.
      </p>

      <form method="get" action="/" className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <label htmlFor="browse-q" className="text-sm font-medium">
            Search title or author
          </label>
          <input
            id="browse-q"
            name="q"
            type="search"
            defaultValue={q}
            className="rounded border border-stone-400 bg-white px-2 py-1"
          />
        </div>
        <button type="submit" className="rounded bg-stone-900 px-3 py-1.5 text-sm text-white">
          Search
        </button>
        <a href="/" className="py-1.5 text-sm underline underline-offset-4">
          Clear
        </a>
      </form>

      {!anyListed ? (
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
