import { listAllBooks } from "@/lib/books";
import { conditionLabel } from "@/lib/validation";

export default async function AllBooksPage() {
  const { books } = await listAllBooks();

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">All books</h1>
      <p className="mt-2 text-stone-700">Every book a student has listed. Search comes later.</p>
      {books.length === 0 ? (
        <p className="mt-6 text-stone-700">No books are listed yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {books.map((book) => (
            <li key={book.id} className="rounded border border-stone-300 bg-white px-4 py-3">
              <p className="font-medium">{book.title}</p>
              <p className="text-sm text-stone-700">{book.author}</p>
              <p className="mt-2 text-sm">
                {conditionLabel(book.condition)} · {book.genre}
              </p>
              <p className="text-sm text-stone-700">Owner: {book.ownerName}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
