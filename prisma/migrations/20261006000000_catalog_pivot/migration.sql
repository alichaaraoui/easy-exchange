-- v1 books have no category, so plan v2 starts the catalog over (approved by Ali, 2026-10-06).
-- The seed reloads the 12 books afterwards.
DELETE FROM "Trade";
DELETE FROM "Book";

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ARCHITECTURE_MONOGRAPH', 'ARCHITECTURAL_THEORY', 'ART_HISTORY', 'EXHIBITION_CATALOGUE', 'PHOTOGRAPHY', 'DESIGN', 'ARTIST_BOOK_ZINE');

-- CreateEnum
CREATE TYPE "JacketCondition" AS ENUM ('NONE', 'POOR', 'FAIR', 'GOOD', 'FINE');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "genre",
ADD COLUMN     "category" "Category" NOT NULL,
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "edition" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "jacketCondition" "JacketCondition" NOT NULL,
ADD COLUMN     "outOfPrint" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publisher" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

