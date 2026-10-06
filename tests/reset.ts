import { prisma } from "@/lib/prisma";
import { seed } from "../prisma/seed";

export async function resetAndSeed() {
  await prisma.trade.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
  await seed();
}
