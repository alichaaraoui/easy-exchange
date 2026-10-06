export const COOKIE_NAME = "easy_exchange_user";
export const MAYA_ID = "user_maya";

export const DEMO_USER_ORDER = ["user_maya", "user_jordan", "user_sam"] as const;

export type Failure = {
  ok: false;
  status: 400 | 403 | 404 | 409;
  message: string;
};

export function sortUsers<T extends { id: string }>(users: T[]): T[] {
  return [...users].sort((a, b) => {
    const aIndex = DEMO_USER_ORDER.indexOf(a.id as (typeof DEMO_USER_ORDER)[number]);
    const bIndex = DEMO_USER_ORDER.indexOf(b.id as (typeof DEMO_USER_ORDER)[number]);
    if (aIndex === -1 && bIndex === -1) return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export function applySwitch(
  knownIds: string[],
  requestedId: string,
  currentId: string | null,
): { ok: true; userId: string } | (Failure & { userId: string | null }) {
  const trimmed = requestedId.trim();
  if (!trimmed) {
    return { ok: false, status: 400, message: "Choose a user.", userId: currentId };
  }
  if (!knownIds.includes(trimmed)) {
    return {
      ok: false,
      status: 404,
      message: "That user is not in the demo.",
      userId: currentId,
    };
  }
  return { ok: true, userId: trimmed };
}

export function resolveActiveUserId(
  cookieValue: string | undefined,
  knownIds: string[],
): { ok: true; userId: string } | Failure {
  if (cookieValue && knownIds.includes(cookieValue)) {
    return { ok: true, userId: cookieValue };
  }
  if (knownIds.includes(MAYA_ID)) {
    return { ok: true, userId: MAYA_ID };
  }
  return { ok: false, status: 404, message: "No demo user is available." };
}
