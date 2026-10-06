import { BookCover } from "@/components/book-cover";
import type { BookView } from "@/lib/books";
import { categoryLabel, conditionLabel } from "@/lib/labels";

export function BookCard({ book }: { book: BookView }) {
  return (
    <article className="flex flex-col gap-2">
      <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} />
      <div>
        <p className="font-medium leading-snug">{book.title}</p>
        <p className="text-sm text-stone-700">{book.author}</p>
        <p className="mt-1 text-xs text-stone-700">
          {categoryLabel(book.category)} · {conditionLabel(book.condition)}
        </p>
        <p className="text-xs text-stone-600">Owner: {book.ownerName}</p>
        {book.outOfPrint ? (
          <p className="mt-1 w-fit rounded border border-stone-400 px-1.5 text-xs">Out of print</p>
        ) : null}
      </div>
    </article>
  );
}
