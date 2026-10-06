import { listAllBooks } from "@/lib/books";
import { BookCard } from "@/components/book-card";

export default async function AllBooksPage() {
  const { books } = await listAllBooks();

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">All books</h1>
      <p className="mt-2 text-stone-700">Every book a student has listed. Search comes later.</p>
      {books.length === 0 ? (
        <p className="mt-6 text-stone-700">No books are listed yet.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <li key={book.id}>
              <BookCard book={book} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
