"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { applySwitch, COOKIE_NAME, resolveActiveUserId, sortUsers } from "@/lib/session";

export async function listUsers() {
  const users = await prisma.user.findMany();
  return sortUsers(users);
}

export async function readActiveUser() {
  const users = await listUsers();
  const jar = await cookies();
  const resolved = resolveActiveUserId(
    jar.get(COOKIE_NAME)?.value,
    users.map((user) => user.id),
  );
  if (!resolved.ok) return null;
  return users.find((user) => user.id === resolved.userId) ?? null;
}

export async function setActiveUserAction(formData: FormData) {
  const users = await listUsers();
  const jar = await cookies();
  const current = jar.get(COOKIE_NAME)?.value ?? null;
  const result = applySwitch(
    users.map((user) => user.id),
    String(formData.get("userId") ?? ""),
    current,
  );
  if (result.ok) {
    jar.set(COOKIE_NAME, result.userId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
  }
  redirect("/");
}
