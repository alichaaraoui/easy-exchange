import { Condition, type Book } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const CONDITIONS = ["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"] as const;
export type ConditionGrade = (typeof CONDITIONS)[number];

export type Failure = {
  ok: false;
  status: 400 | 403 | 404 | 409;
  message: string;
};

export function isCondition(value: string): value is ConditionGrade {
  return (CONDITIONS as readonly string[]).includes(value);
}

export async function writeBook(input: {
  id: string;
  title: string;
  author: string;
  isbn: string;
  condition: string;
  genre: string;
  ownerId: string;
}): Promise<{ ok: true; book: Book } | Failure> {
  if (!isCondition(input.condition)) {
    return {
      ok: false,
      status: 400,
      message: "Condition must be NEW, LIKE_NEW, GOOD, FAIR, or POOR.",
    };
  }

  const book = await prisma.book.create({
    data: {
      id: input.id,
      title: input.title,
      author: input.author,
      isbn: input.isbn,
      condition: input.condition as Condition,
      genre: input.genre,
      ownerId: input.ownerId,
    },
  });

  return { ok: true, book };
}
