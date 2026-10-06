import { createBookAction } from "@/app/actions/books";
import { BookForm } from "@/components/book-form";
import { EMPTY_BOOK_FORM } from "@/lib/book-form";

export default function NewBookPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Add a book</h1>
      <div className="mt-6">
        <BookForm
          action={createBookAction}
          submitLabel="Add book"
          values={EMPTY_BOOK_FORM}
        />
      </div>
    </section>
  );
}
