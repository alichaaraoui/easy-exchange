import type { Book, Prisma } from "@prisma/client";
import { lookupCover } from "@/lib/covers";
import { prisma } from "@/lib/prisma";
import {
  isCategory,
  isCondition,
  validateBookFields,
  type BookFieldsInput,
  type ConditionGrade,
  type Failure,
} from "@/lib/validation";

export { CATEGORIES, CONDITIONS, JACKET_CONDITIONS, isCondition } from "@/lib/validation";
export type { ConditionGrade, Failure };

export async function writeBook(
  input: BookFieldsInput & { id: string; ownerId: string; coverUrl?: string | null },
): Promise<{ ok: true; book: Book } | Failure> {
  const parsed = validateBookFields(input);
  if (!parsed.ok) return parsed;

  const book = await prisma.book.create({
    data: { ...parsed.value, id: input.id, ownerId: input.ownerId, coverUrl: input.coverUrl ?? null },
  });

  return { ok: true, book };
}

export type BookView = Book & { ownerName: string };

function toView(book: Book & { owner: { name: string } }): BookView {
  const { owner, ...rest } = book;
  return { ...rest, ownerName: owner.name };
}

function isSeedId(id: string) {
  return /^book_\d+$/.test(id);
}

function compareShelfIds(a: string, b: string) {
  const aSeed = isSeedId(a);
  const bSeed = isSeedId(b);
  if (aSeed !== bSeed) return aSeed ? -1 : 1;
  return a < b ? -1 : a > b ? 1 : 0;
}

export async function createBook(
  actorId: string,
  input: BookFieldsInput,
): Promise<{ ok: true; book: Book } | Failure> {
  const parsed = validateBookFields(input);
  if (!parsed.ok) return parsed;

  const coverUrl = await lookupCover(parsed.value.isbn);
  const book = await prisma.book.create({
    data: {
      ...parsed.value,
      id: `book_${crypto.randomUUID()}`,
      ownerId: actorId,
      coverUrl,
    },
  });

  return { ok: true, book };
}

export async function updateBook(
  actorId: string,
  bookId: string,
  input: BookFieldsInput,
): Promise<{ ok: true; book: Book } | Failure> {
  const existing = await prisma.book.findUnique({ where: { id: bookId } });
  if (!existing) return { ok: false, status: 404, message: "That book is not listed." };
  if (existing.ownerId !== actorId) {
    return { ok: false, status: 403, message: "You can only edit a book you own." };
  }

  const parsed = validateBookFields(input);
  if (!parsed.ok) return parsed;

  const isbnChanged = parsed.value.isbn !== existing.isbn;
  const book = await prisma.book.update({
    where: { id: bookId },
    data: isbnChanged
      ? { ...parsed.value, coverUrl: await lookupCover(parsed.value.isbn) }
      : parsed.value,
  });

  return { ok: true, book };
}

export async function deleteBook(actorId: string, bookId: string): Promise<{ ok: true } | Failure> {
  const existing = await prisma.book.findUnique({ where: { id: bookId } });
  if (!existing) return { ok: false, status: 404, message: "That book is not listed." };
  if (existing.ownerId !== actorId) {
    return { ok: false, status: 403, message: "You can only delete a book you own." };
  }

  await prisma.book.delete({ where: { id: bookId } });
  return { ok: true };
}

export async function listMyBooks(actorId: string): Promise<{ ok: true; books: BookView[] }> {
  const books = await prisma.book.findMany({
    where: { ownerId: actorId },
    include: { owner: true },
  });
  books.sort((a, b) => compareShelfIds(a.id, b.id));
  return { ok: true, books: books.map(toView) };
}

export type BrowseQuery = {
  q?: string;
  category?: string;
  condition?: string;
  outOfPrint?: boolean;
};

type Params = Record<string, string | string[] | undefined>;

export function parseBrowseParams(params: Params): BrowseQuery {
  const first = (name: string) => {
    const value = params[name];
    return (Array.isArray(value) ? value[0] : value) ?? "";
  };
  return {
    q: first("q"),
    category: first("category"),
    condition: first("condition"),
    outOfPrint: first("oop") === "1",
  };
}

export async function searchBooks(
  query: BrowseQuery = {},
): Promise<{ ok: true; books: BookView[] } | Failure> {
  const where: Prisma.BookWhereInput = {};
  const category = query.category?.trim();
  if (category) {
    if (!isCategory(category)) return { ok: false, status: 400, message: "That filter isn't valid." };
    where.category = category;
  }
  const condition = query.condition?.trim();
  if (condition) {
    if (!isCondition(condition)) return { ok: false, status: 400, message: "That filter isn't valid." };
    where.condition = condition;
  }
  if (query.outOfPrint) where.outOfPrint = true;

  const q = query.q?.trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
    ];
  }

  const books = await prisma.book.findMany({ where, include: { owner: true }, orderBy: { id: "asc" } });
  return { ok: true, books: books.map(toView) };
}

export async function listAllBooks(): Promise<{ ok: true; books: BookView[] }> {
  const books = await prisma.book.findMany({ include: { owner: true } });
  books.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { ok: true, books: books.map(toView) };
}

export async function findBook(bookId: string) {
  return prisma.book.findUnique({ where: { id: bookId } });
}
