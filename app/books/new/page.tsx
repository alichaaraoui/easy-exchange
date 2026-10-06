import { createBookAction } from "@/app/actions/books";
import { BookForm } from "@/components/book-form";

export default function NewBookPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Add a book</h1>
      <div className="mt-6">
        <BookForm
          action={createBookAction}
          submitLabel="Add book"
          values={{ title: "", author: "", isbn: "", condition: "GOOD", genre: "" }}
        />
      </div>
    </section>
  );
}
