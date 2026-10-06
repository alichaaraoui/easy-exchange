export const CONDITIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as const;
export type ConditionGrade = (typeof CONDITIONS)[number];

export const CATEGORIES = [
  "ARCHITECTURE_MONOGRAPH",
  "ARCHITECTURAL_THEORY",
  "ART_HISTORY",
  "EXHIBITION_CATALOGUE",
  "PHOTOGRAPHY",
  "DESIGN",
  "ARTIST_BOOK_ZINE",
] as const;
export type CategoryValue = (typeof CATEGORIES)[number];

export const JACKET_CONDITIONS = ["NONE", "POOR", "FAIR", "GOOD", "FINE"] as const;
export type JacketGrade = (typeof JACKET_CONDITIONS)[number];

export const MIN_YEAR = 1450;

export type Failure = {
  ok: false;
  status: 400 | 403 | 404 | 409;
  message: string;
};

export type BookFieldsInput = {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  year: string | number;
  edition?: string;
  outOfPrint?: boolean;
  condition: string;
  jacketCondition: string;
  ownerId?: string;
  coverUrl?: string | null;
};

export type ValidBookFields = {
  title: string;
  author: string;
  isbn: string;
  category: CategoryValue;
  publisher: string;
  year: number;
  edition: string;
  outOfPrint: boolean;
  condition: ConditionGrade;
  jacketCondition: JacketGrade;
};

function oneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

export function isCondition(value: string): value is ConditionGrade {
  return oneOf(CONDITIONS, value);
}

export function isCategory(value: string): value is CategoryValue {
  return oneOf(CATEGORIES, value);
}

export function isJacketCondition(value: string): value is JacketGrade {
  return oneOf(JACKET_CONDITIONS, value);
}

export function maxYear() {
  return new Date().getFullYear();
}

export function parseYear(value: string | number): number | null {
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return null;
  const year = Number(text);
  if (year < MIN_YEAR || year > maxYear()) return null;
  return year;
}

const fail = (message: string): Failure => ({ ok: false, status: 400, message });

export function validateBookFields(
  input: BookFieldsInput,
): { ok: true; value: ValidBookFields } | Failure {
  const title = input.title.trim();
  const author = input.author.trim();
  const isbn = input.isbn.trim();
  const publisher = input.publisher.trim();
  const edition = (input.edition ?? "").trim();

  if (!title) return fail("Title is required.");
  if (!author) return fail("Author is required.");
  if (!isbn) return fail("ISBN is required.");
  if (!isCategory(input.category)) return fail("Category must be one of the seven categories.");
  if (!publisher) return fail("Publisher is required.");
  const year = parseYear(input.year);
  if (year === null) return fail(`Year must be a whole number from ${MIN_YEAR} to ${maxYear()}.`);
  if (!isCondition(input.condition)) {
    return fail("Condition must be NEW, LIKE_NEW, GOOD, FAIR, or POOR.");
  }
  if (!isJacketCondition(input.jacketCondition)) {
    return fail("Jacket condition must be NONE, POOR, FAIR, GOOD, or FINE.");
  }

  return {
    ok: true,
    value: {
      title,
      author,
      isbn,
      category: input.category,
      publisher,
      year,
      edition,
      outOfPrint: input.outOfPrint === true,
      condition: input.condition,
      jacketCondition: input.jacketCondition,
    },
  };
}
