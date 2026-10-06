import { notFound } from "next/navigation";
import { BookDetails } from "@/components/book-details";
import { getBook } from "@/lib/books";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getBook(id);
  if (!result.ok) notFound();

  return (
    <section>
      <BookDetails book={result.book} />
    </section>
  );
}
