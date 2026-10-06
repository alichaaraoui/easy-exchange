import { BookCover } from "@/components/book-cover";
import type { BookView } from "@/lib/books";
import { categoryLabel, conditionLabel, jacketLabel } from "@/lib/labels";

export function BookDetails({ book }: { book: BookView }) {
  const rows: [string, string][] = [
    ["ISBN", book.isbn],
    ["Category", categoryLabel(book.category)],
    ["Publisher", book.publisher],
    ["Year", String(book.year)],
    ["Edition", book.edition || "—"],
    ["Out of print", book.outOfPrint ? "Yes" : "No"],
    ["Condition", conditionLabel(book.condition)],
    ["Jacket condition", jacketLabel(book.jacketCondition)],
    ["Owner", book.ownerName],
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,16rem)_1fr]">
      <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} className="max-w-64" />
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{book.title}</h1>
        <p className="mt-1 text-stone-700">{book.author}</p>
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          {rows.map(([term, value]) => (
            <div key={term} className="contents">
              <dt className="font-medium text-stone-600">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
