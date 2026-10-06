import type { Book } from "@prisma/client";
import type { BookFieldsInput } from "@/lib/validation";

export type BookFormValues = {
  bookId?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: string;
  edition: string;
  outOfPrint: boolean;
  condition: string;
  jacketCondition: string;
};

export const EMPTY_BOOK_FORM: BookFormValues = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publisher: "",
  year: "",
  edition: "",
  outOfPrint: false,
  condition: "GOOD",
  jacketCondition: "NONE",
};

export function readBookForm(formData: FormData): BookFormValues {
  const text = (name: string) => String(formData.get(name) ?? "");
  return {
    title: text("title"),
    author: text("author"),
    isbn: text("isbn"),
    category: text("category"),
    publisher: text("publisher"),
    year: text("year"),
    edition: text("edition"),
    outOfPrint: formData.get("outOfPrint") !== null,
    condition: text("condition"),
    jacketCondition: text("jacketCondition"),
  };
}

export function toBookInput(values: BookFormValues): BookFieldsInput {
  const { bookId: _bookId, ...fields } = values;
  return fields;
}

export function bookToFormValues(book: Book): BookFormValues {
  return {
    bookId: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category,
    publisher: book.publisher,
    year: String(book.year),
    edition: book.edition,
    outOfPrint: book.outOfPrint,
    condition: book.condition,
    jacketCondition: book.jacketCondition,
  };
}
