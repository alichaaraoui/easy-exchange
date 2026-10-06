import { deleteBookAction, updateBookAction } from "@/app/actions/books";
import { readActiveUser } from "@/app/actions/session";
import { BookForm } from "@/components/book-form";
import { findBook } from "@/lib/books";

export default async function EditBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const book = await findBook(id);

  if (!book) {
    return (
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Edit book</h1>
        <p className="mt-4">That book is not listed.</p>
      </section>
    );
  }

  const user = await readActiveUser();
  if (!user || book.ownerId !== user.id) {
    return (
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Edit book</h1>
        <p className="mt-4">You can only edit a book you own.</p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Edit book</h1>
      {error ? (
        <p role="alert" className="mt-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}
      <div className="mt-6">
        <BookForm
          action={updateBookAction}
          submitLabel="Save"
          values={{
            bookId: book.id,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            condition: book.condition,
            genre: book.genre,
          }}
        />
      </div>
      <form action={deleteBookAction} className="mt-4">
        <input type="hidden" name="bookId" value={book.id} />
        <button type="submit" className="text-sm text-red-800 underline underline-offset-4">
          Delete {book.title}
        </button>
      </form>
    </section>
  );
}
