import { CATEGORY_LABELS, conditionLabel } from "@/lib/labels";
import { CATEGORIES, CONDITIONS } from "@/lib/validation";

export function BookFields({
  values,
}: {
  values: {
    bookId?: string;
    title: string;
    author: string;
    isbn: string;
    condition: string;
    category: string;
  };
}) {
  return (
    <div className="flex flex-col gap-4">
      {values.bookId ? <input type="hidden" name="bookId" value={values.bookId} /> : null}
      <div className="flex flex-col gap-1">
        <label htmlFor="book-title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="book-title"
          name="title"
          defaultValue={values.title}
          className="rounded border border-stone-400 px-2 py-1"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="book-author" className="text-sm font-medium">
          Author
        </label>
        <input
          id="book-author"
          name="author"
          defaultValue={values.author}
          className="rounded border border-stone-400 px-2 py-1"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="book-isbn" className="text-sm font-medium">
          ISBN
        </label>
        <input
          id="book-isbn"
          name="isbn"
          defaultValue={values.isbn}
          className="rounded border border-stone-400 px-2 py-1"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="book-condition" className="text-sm font-medium">
          Condition
        </label>
        <select
          id="book-condition"
          name="condition"
          defaultValue={values.condition || "GOOD"}
          className="rounded border border-stone-400 bg-white px-2 py-1"
        >
          {CONDITIONS.map((condition) => (
            <option key={condition} value={condition}>
              {conditionLabel(condition)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="book-category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="book-category"
          name="category"
          defaultValue={values.category}
          className="rounded border border-stone-400 bg-white px-2 py-1"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
