import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { Header } from "@/components/header";
import { prisma } from "@/lib/prisma";
import { applySwitch, resolveActiveUserId, sortUsers } from "@/lib/session";
import { resetAndSeed } from "./reset";

beforeEach(async () => {
  await resetAndSeed();
});

describe("FR-002 switch the active demo user", () => {
  it("FR-002-AC1 renders the three demo names and no password field", async () => {
    const users = sortUsers(await prisma.user.findMany());
    const html = renderToStaticMarkup(
      Header({
        users,
        activeUserId: "user_maya",
        showBookLinks: false,
        switchAction: () => undefined,
      }),
    );

    expect(html).toContain("Maya Chen");
    expect(html).toContain("Jordan Hale");
    expect(html).toContain("Sam Rivera");
    expect(html.toLowerCase()).not.toContain("password");
    expect(users.map((user) => user.name)).toEqual([
      "Maya Chen",
      "Jordan Hale",
      "Sam Rivera",
    ]);
  });

  it("FR-002-AC2 keeps Jordan Hale active after the switch", async () => {
    const ids = (await prisma.user.findMany()).map((user) => user.id);
    const switched = applySwitch(ids, "user_jordan", "user_maya");
    expect(switched).toEqual({ ok: true, userId: "user_jordan" });
    if (!switched.ok) return;

    const again = resolveActiveUserId(switched.userId, ids);
    expect(again).toEqual({ ok: true, userId: "user_jordan" });
  });

  it("FR-002-AC3 returns 404 for an unknown id and leaves Maya active", () => {
    const ids = ["user_maya", "user_jordan", "user_sam"];
    const denied = applySwitch(ids, "user_missing", "user_maya");
    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.status).toBe(404);
      expect(denied.userId).toBe("user_maya");
    }
  });
});
