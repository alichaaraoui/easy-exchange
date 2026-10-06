export const COVER_TIMEOUT_MS = 3000;

export function normalizeIsbn(isbn: string) {
  return isbn.replace(/[\s-]/g, "");
}

export function coverUrlFor(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(normalizeIsbn(isbn))}-L.jpg`;
}

export async function lookupCover(
  isbn: string,
  { timeoutMs = COVER_TIMEOUT_MS }: { timeoutMs?: number } = {},
): Promise<string | null> {
  const url = coverUrlFor(isbn);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${url}?default=false`, { signal: controller.signal });
    await response.body?.cancel().catch(() => undefined);
    return response.status === 200 ? url : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
