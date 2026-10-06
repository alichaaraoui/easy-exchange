import { beforeEach, describe, expect, it, vi } from "vitest";
import { createBook, updateBook } from "@/lib/books";
import { COVER_TIMEOUT_MS, lookupCover } from "@/lib/covers";
import { prisma } from "@/lib/prisma";
import { resetAndSeed } from "./reset";

const input = {
  title: "The Architecture of the City",
  author: "Aldo Rossi",
  isbn: "0262680432",
  category: "ARCHITECTURAL_THEORY",
  publisher: "MIT Press",
  year: "1984",
  edition: "",
  outOfPrint: false,
  condition: "GOOD",
  jacketCondition: "NONE",
};

const book01 = {
  title: "Toward an Architecture",
  author: "Le Corbusier",
  isbn: "0892368225",
  category: "ARCHITECTURAL_THEORY",
  publisher: "Getty Research Institute",
  year: 2007,
  edition: "",
  outOfPrint: false,
  condition: "GOOD",
  jacketCondition: "NONE",
};

function stubFetch(impl: (url: string, init?: RequestInit) => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(async () => {
  await resetAndSeed();
});

describe("FR-021 cover lookup by ISBN", () => {
  it("FR-021-AC1 saves the Open Library URL when a cover exists", async () => {
    const fetchMock = stubFetch(async () => new Response("jpg", { status: 200 }));
    const result = await createBook("user_maya", input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(fetchMock).toHaveBeenCalledWith(
      "https://covers.openlibrary.org/b/isbn/0262680432-L.jpg?default=false",
      expect.anything(),
    );
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored?.coverUrl).toBe("https://covers.openlibrary.org/b/isbn/0262680432-L.jpg");
  });

  it("FR-021-AC2 saves null when Open Library answers 404", async () => {
    stubFetch(async () => new Response(null, { status: 404 }));
    const result = await createBook("user_maya", input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored?.coverUrl).toBeNull();
  });

  it("FR-021-AC3 still saves the book with null when Open Library is unreachable or too slow", async () => {
    stubFetch(async () => {
      throw new TypeError("fetch failed");
    });
    const result = await createBook("user_maya", input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const stored = await prisma.book.findUnique({ where: { id: result.book.id } });
    expect(stored).not.toBeNull();
    expect(stored?.coverUrl).toBeNull();

    expect(COVER_TIMEOUT_MS).toBe(3000);
    stubFetch(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
        }),
    );
    await expect(lookupCover("0262680432", { timeoutMs: 20 })).resolves.toBeNull();
  });

  it("FR-021-AC4 looks the cover up again when the ISBN changes", async () => {
    const fetchMock = stubFetch(async () => new Response(null, { status: 404 }));
    const result = await updateBook("user_maya", "book_01", { ...book01, isbn: "0262680432" });
    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/b/isbn/0262680432-L.jpg");
    const stored = await prisma.book.findUnique({ where: { id: "book_01" } });
    expect(stored?.coverUrl).toBeNull();
  });

  it("FR-021-AC5 does not call Open Library when the ISBN is unchanged", async () => {
    const fetchMock = stubFetch(async () => new Response(null, { status: 200 }));
    const result = await updateBook("user_maya", "book_01", { ...book01, title: "Towards a New Architecture" });
    expect(result.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    const stored = await prisma.book.findUnique({ where: { id: "book_01" } });
    expect(stored?.coverUrl).toBe("https://covers.openlibrary.org/b/isbn/0892368225-L.jpg");
  });
});
