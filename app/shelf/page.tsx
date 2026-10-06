import { deleteBookAction } from "@/app/actions/books";
import { readActiveUser } from "@/app/actions/session";
import { listMyBooks } from "@/lib/books";
import { categoryLabel, conditionLabel } from "@/lib/labels";

export default async function ShelfPage() {
  const user = await readActiveUser();
  const books = user ? (await listMyBooks(user.id)).books : [];

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">My shelf</h1>
      <p className="mt-2 text-stone-700">Books you own. Only you can change them.</p>
      {books.length === 0 ? (
        <p className="mt-6 text-stone-700">You have no books listed yet.</p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {books.map((book) => (
            <li key={book.id} className="rounded border border-stone-300 bg-white px-4 py-3">
              <p className="font-medium">{book.title}</p>
              <p className="text-sm text-stone-700">{book.author}</p>
              <p className="mt-2 text-sm">
                {conditionLabel(book.condition)} · {categoryLabel(book.category)}
              </p>
              <p className="text-sm text-stone-700">ISBN {book.isbn}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href={`/books/${book.id}/edit`} className="text-sm underline underline-offset-4">
                  Edit
                </a>
                <form action={deleteBookAction}>
                  <input type="hidden" name="bookId" value={book.id} />
                  <button type="submit" className="text-sm text-red-800 underline underline-offset-4">
                    Delete {book.title}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
