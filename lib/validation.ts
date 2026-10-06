export const CONDITIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as const;
export type ConditionGrade = (typeof CONDITIONS)[number];

export type Failure = {
  ok: false;
  status: 400 | 403 | 404 | 409;
  message: string;
};

export type BookFieldsInput = {
  title: string;
  author: string;
  isbn: string;
  condition: string;
  genre: string;
  ownerId?: string;
};

export type ValidBookFields = {
  title: string;
  author: string;
  isbn: string;
  condition: ConditionGrade;
  genre: string;
};

const LABELS: Record<ConditionGrade, string> = {
  NEW: "New",
  LIKE_NEW: "Like new",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

export function isCondition(value: string): value is ConditionGrade {
  return (CONDITIONS as readonly string[]).includes(value);
}

export function conditionLabel(value: string): string {
  if (isCondition(value)) return LABELS[value];
  return value;
}

export function validateBookFields(
  input: BookFieldsInput,
): { ok: true; value: ValidBookFields } | Failure {
  const title = input.title.trim();
  const author = input.author.trim();
  const isbn = input.isbn.trim();
  const genre = input.genre.trim();

  if (!title) return { ok: false, status: 400, message: "Title is required." };
  if (!author) return { ok: false, status: 400, message: "Author is required." };
  if (!isbn) return { ok: false, status: 400, message: "ISBN is required." };
  if (!isCondition(input.condition)) {
    return {
      ok: false,
      status: 400,
      message: "Condition must be NEW, LIKE_NEW, GOOD, FAIR, or POOR.",
    };
  }
  if (!genre) return { ok: false, status: 400, message: "Genre is required." };

  return { ok: true, value: { title, author, isbn, condition: input.condition, genre } };
}
