import type { Category, Condition, JacketCondition, PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

type SeedBook = {
  id: string;
  ownerId: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  edition: string;
  isbn: string;
  category: Category;
  condition: Condition;
  jacketCondition: JacketCondition;
  outOfPrint: boolean;
  coverUrl: string | null;
};

export const seedUsers = [
  { id: "user_maya", name: "Maya Chen" },
  { id: "user_jordan", name: "Jordan Hale" },
  { id: "user_sam", name: "Sam Rivera" },
];

const cover = (isbn: string) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

export const seedBooks: SeedBook[] = [
  { id: "book_01", ownerId: "user_maya", title: "Toward an Architecture", author: "Le Corbusier", publisher: "Getty Research Institute", year: 2007, edition: "", isbn: "0892368225", category: "ARCHITECTURAL_THEORY", condition: "GOOD", jacketCondition: "NONE", outOfPrint: false, coverUrl: cover("0892368225") },
  { id: "book_02", ownerId: "user_maya", title: "Thinking with Type", author: "Ellen Lupton", publisher: "Princeton Architectural Press", year: 2010, edition: "2nd rev. ed.", isbn: "1568989695", category: "DESIGN", condition: "LIKE_NEW", jacketCondition: "NONE", outOfPrint: false, coverUrl: cover("1568989695") },
  { id: "book_03", ownerId: "user_maya", title: "Ways of Seeing", author: "John Berger", publisher: "Penguin", year: 1990, edition: "", isbn: "0140135154", category: "ART_HISTORY", condition: "FAIR", jacketCondition: "NONE", outOfPrint: false, coverUrl: cover("0140135154") },
  { id: "book_04", ownerId: "user_maya", title: "On Photography", author: "Susan Sontag", publisher: "Picador", year: 2001, edition: "", isbn: "0312420099", category: "PHOTOGRAPHY", condition: "GOOD", jacketCondition: "NONE", outOfPrint: false, coverUrl: cover("0312420099") },
  { id: "book_05", ownerId: "user_jordan", title: "S, M, L, XL", author: "Rem Koolhaas, Bruce Mau", publisher: "Monacelli Press", year: 1995, edition: "1st ed.", isbn: "1885254016", category: "ARCHITECTURE_MONOGRAPH", condition: "GOOD", jacketCondition: "NONE", outOfPrint: false, coverUrl: cover("1885254016") },
  { id: "book_06", ownerId: "user_jordan", title: "Delirious New York", author: "Rem Koolhaas", publisher: "Monacelli Press", year: 1994, edition: "New ed.", isbn: "1885254008", category: "ARCHITECTURAL_THEORY", condition: "LIKE_NEW", jacketCondition: "GOOD", outOfPrint: false, coverUrl: cover("1885254008") },
  { id: "book_07", ownerId: "user_jordan", title: "Deconstructivist Architecture", author: "Philip Johnson, Mark Wigley", publisher: "Museum of Modern Art", year: 1988, edition: "1st ed.", isbn: "087070298X", category: "EXHIBITION_CATALOGUE", condition: "GOOD", jacketCondition: "NONE", outOfPrint: true, coverUrl: cover("087070298X") },
  { id: "book_08", ownerId: "user_jordan", title: "Learning from Las Vegas", author: "Robert Venturi, Denise Scott Brown, Steven Izenour", publisher: "MIT Press", year: 1972, edition: "1st ed.", isbn: "0262220156", category: "ARCHITECTURAL_THEORY", condition: "FAIR", jacketCondition: "POOR", outOfPrint: true, coverUrl: null },
  { id: "book_09", ownerId: "user_sam", title: "The Story of Art", author: "E. H. Gombrich", publisher: "Phaidon", year: 1995, edition: "16th ed.", isbn: "0714832472", category: "ART_HISTORY", condition: "GOOD", jacketCondition: "GOOD", outOfPrint: false, coverUrl: cover("0714832472") },
  { id: "book_10", ownerId: "user_sam", title: "Uncommon Places", author: "Stephen Shore", publisher: "Aperture", year: 2005, edition: "Revised ed.", isbn: "1931788340", category: "PHOTOGRAPHY", condition: "NEW", jacketCondition: "FINE", outOfPrint: false, coverUrl: cover("1931788340") },
  { id: "book_11", ownerId: "user_sam", title: "Grid Systems in Graphic Design", author: "Josef Müller-Brockmann", publisher: "Niggli", year: 1996, edition: "4th rev. ed.", isbn: "3721201450", category: "DESIGN", condition: "LIKE_NEW", jacketCondition: "NONE", outOfPrint: false, coverUrl: cover("3721201450") },
  { id: "book_12", ownerId: "user_sam", title: "Twentysix Gasoline Stations", author: "Michalis Pichler", publisher: "Printed Matter", year: 2009, edition: "", isbn: "0894390449", category: "ARTIST_BOOK_ZINE", condition: "POOR", jacketCondition: "NONE", outOfPrint: false, coverUrl: null },
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
