import type { BrowseQuery } from "@/lib/books";
import { CATEGORY_LABELS, CONDITION_LABELS } from "@/lib/labels";
import { CATEGORIES, CONDITIONS } from "@/lib/validation";

const control = "rounded border border-stone-400 bg-white px-2 py-1";

export function BrowseFilters({ query }: { query: BrowseQuery }) {
  return (
    <form method="get" action="/" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor="browse-q" className="text-sm font-medium">
          Search title or author
        </label>
        <input id="browse-q" name="q" type="search" defaultValue={query.q ?? ""} className={control} />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor="browse-category" className="text-sm font-medium">
          Category
        </label>
        <select id="browse-category" name="category" defaultValue={query.category ?? ""} className={control}>
          <option value="">Any category</option>
          {CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <label htmlFor="browse-condition" className="text-sm font-medium">
          Condition
        </label>
        <select id="browse-condition" name="condition" defaultValue={query.condition ?? ""} className={control}>
          <option value="">Any condition</option>
          {CONDITIONS.map((value) => (
            <option key={value} value={value}>
              {CONDITION_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end gap-2 pb-1">
        <input
          id="browse-oop"
          name="oop"
          type="checkbox"
          value="1"
          defaultChecked={query.outOfPrint === true}
          className="h-4 w-4"
        />
        <label htmlFor="browse-oop" className="text-sm font-medium">
          Out of print only
        </label>
      </div>
      <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-4">
        <button type="submit" className="rounded bg-stone-900 px-3 py-1.5 text-sm text-white">
          Search
        </button>
        <a href="/" className="text-sm underline underline-offset-4">
          Clear
        </a>
      </div>
    </form>
  );
}
