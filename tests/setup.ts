import { beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.unstubAllGlobals();
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 404 })),
  );
});
