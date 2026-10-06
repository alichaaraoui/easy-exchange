import type { BookFormValues } from "@/lib/book-form";
import { CATEGORY_LABELS, CONDITION_LABELS, JACKET_LABELS } from "@/lib/labels";
import { CATEGORIES, CONDITIONS, JACKET_CONDITIONS, MIN_YEAR, maxYear } from "@/lib/validation";

const inputClass = "rounded border border-stone-400 bg-white px-2 py-1";

function TextField({
  id,
  name,
  label,
  defaultValue,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input id={id} name={name} defaultValue={defaultValue} className={inputClass} />
      {hint ? <p className="text-xs text-stone-600">{hint}</p> : null}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  defaultValue,
  options,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select id={id} name={name} defaultValue={defaultValue} className={inputClass}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function BookFields({ values }: { values: BookFormValues }) {
  return (
    <div className="flex flex-col gap-4">
      {values.bookId ? <input type="hidden" name="bookId" value={values.bookId} /> : null}
      <TextField id="book-title" name="title" label="Title" defaultValue={values.title} />
      <TextField id="book-author" name="author" label="Author" defaultValue={values.author} />
      <TextField
        id="book-isbn"
        name="isbn"
        label="ISBN"
        defaultValue={values.isbn}
        hint="We look up the cover on Open Library by ISBN."
      />
      <SelectField
        id="book-category"
        name="category"
        label="Category"
        defaultValue={values.category}
        placeholder="Choose a category"
        options={CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] }))}
      />
      <TextField id="book-publisher" name="publisher" label="Publisher" defaultValue={values.publisher} />
      <div className="flex flex-col gap-1">
        <label htmlFor="book-year" className="text-sm font-medium">
          Year
        </label>
        <input
          id="book-year"
          name="year"
          type="number"
          inputMode="numeric"
          min={MIN_YEAR}
          max={maxYear()}
          step={1}
          defaultValue={values.year}
          className={inputClass}
        />
      </div>
      <TextField id="book-edition" name="edition" label="Edition (optional)" defaultValue={values.edition} />
      <div className="flex items-center gap-2">
        <input
          id="book-out-of-print"
          name="outOfPrint"
          type="checkbox"
          defaultChecked={values.outOfPrint}
          className="h-4 w-4"
        />
        <label htmlFor="book-out-of-print" className="text-sm font-medium">
          Out of print
        </label>
      </div>
      <SelectField
        id="book-condition"
        name="condition"
        label="Condition"
        defaultValue={values.condition}
        options={CONDITIONS.map((value) => ({ value, label: CONDITION_LABELS[value] }))}
      />
      <SelectField
        id="book-jacket"
        name="jacketCondition"
        label="Jacket condition"
        defaultValue={values.jacketCondition}
        options={JACKET_CONDITIONS.map((value) => ({ value, label: JACKET_LABELS[value] }))}
      />
    </div>
  );
}
