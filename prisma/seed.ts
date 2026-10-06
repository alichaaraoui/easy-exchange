import { PrismaClient, type Condition } from "@prisma/client";
import { prisma } from "../lib/prisma";

type SeedBook = {
  id: string;
  ownerId: string;
  title: string;
  author: string;
  isbn: string;
  condition: Condition;
  genre: string;
};

export const seedUsers = [
  { id: "user_maya", name: "Maya Chen" },
  { id: "user_jordan", name: "Jordan Hale" },
  { id: "user_sam", name: "Sam Rivera" },
];

export const seedBooks: SeedBook[] = [
  { id: "book_01", ownerId: "user_maya", title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", condition: "GOOD", genre: "Software" },
  { id: "book_02", ownerId: "user_maya", title: "The Pragmatic Programmer", author: "David Thomas", isbn: "9780135957059", condition: "LIKE_NEW", genre: "Software" },
  { id: "book_03", ownerId: "user_maya", title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "9780262046305", condition: "FAIR", genre: "Computer Science" },
  { id: "book_04", ownerId: "user_maya", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", isbn: "9781449373320", condition: "NEW", genre: "Computer Science" },
  { id: "book_05", ownerId: "user_jordan", title: "Calculus", author: "James Stewart", isbn: "9781285740621", condition: "GOOD", genre: "Mathematics" },
  { id: "book_06", ownerId: "user_jordan", title: "Linear Algebra Done Right", author: "Sheldon Axler", isbn: "9783319110790", condition: "LIKE_NEW", genre: "Mathematics" },
  { id: "book_07", ownerId: "user_jordan", title: "A Brief History of Time", author: "Stephen Hawking", isbn: "9780553380163", condition: "GOOD", genre: "Science" },
  { id: "book_08", ownerId: "user_jordan", title: "The Structure of Scientific Revolutions", author: "Thomas Kuhn", isbn: "9780226458120", condition: "FAIR", genre: "History" },
  { id: "book_09", ownerId: "user_sam", title: "Campbell Biology", author: "Lisa Urry", isbn: "9780134093413", condition: "POOR", genre: "Biology" },
  { id: "book_10", ownerId: "user_sam", title: "The Gene", author: "Siddhartha Mukherjee", isbn: "9781476733524", condition: "GOOD", genre: "Biology" },
  { id: "book_11", ownerId: "user_sam", title: "Ways of Seeing", author: "John Berger", isbn: "9780140135152", condition: "LIKE_NEW", genre: "Art" },
  { id: "book_12", ownerId: "user_sam", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "9780374533557", condition: "NEW", genre: "Psychology" },
];

export async function seed(db: PrismaClient = prisma) {
  for (const user of seedUsers) {
    await db.user.upsert({
      where: { id: user.id },
      update: { name: user.name },
      create: user,
    });
  }

  for (const book of seedBooks) {
    await db.book.upsert({
      where: { id: book.id },
      update: book,
      create: book,
    });
  }
}

const entry = process.argv[1] ?? "";
if (entry.endsWith("seed.ts") || entry.endsWith("seed.js")) {
  seed()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error: unknown) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
