# Process log

Running log for Easy Exchange. One entry per prompt.

Columns: date | phase | prompt | skill used | outcome | what I fixed.

Entry template:

```md
### 2026-10-07 · Planning · Prompt #3
**Prompt:** (paste)
**Mode / Skill:** Plan mode, /book-exchange-domain
**Result:** what the agent produced
**My judgment:** what I kept, rejected, or rewrote, and why
```

The "My judgment" line is the part that matters: what was kept, rejected, or rewritten, and why.

---

### 2026-10-06 · Setup · Phase 0

**Prompt:** Set up the repo from the playbook only. Rename `alichaaraoui/bookExchange` to `easy-exchange`, point `origin` at the new URL, and add `docs/process-log.md`, `docs/plan.md`, `specs/.gitkeep`, and `.cursor/skills/.gitkeep`. No application code. Do not invent product scope.

**Mode / Skill:** Agent. No project skill yet (`.cursor/skills/` is empty on purpose; custom skills are Phase 2).

**Result:** Repository renamed. `origin` is `https://github.com/alichaaraoui/easy-exchange.git`. Added this log, `docs/plan.md` (Phase 1 sections, content taken from the playbook), and empty `specs/` and `.cursor/skills/` placeholders.

**My judgment:** Kept the playbook's users, MVP, out-of-scope list, stack, domain rules, and M1–M5. Did not add features the playbook does not name. Left `specs/` and `.cursor/skills/` empty for Phase 3 and Phase 2.

---

### 2026-10-06 · Setup · Skills

**Prompt:** Add `.gitignore` (`node_modules`, `.DS_Store`, `.env`, `*.db`, `.next`) and commit the four skills in `.cursor/skills/` as `feat: add project skills`. Do not rewrite the skill files.

**Mode / Skill:** No skill invoked. The files are the skills I will use in the next steps.

**Result:** Copied `requirements-engineering`, `spec-writer`, `book-exchange-domain`, and `implement-from-spec` as they were written. Added `.gitignore`. Left `.cursor/skills/.gitkeep`.

**My judgment:** I did not edit the skill text. I ignored `.DS_Store` instead of committing it.

---

### 2026-10-06 · Planning · Plan rewrite

**Prompt:** Rewrite `docs/plan.md` in the first person. Remove every mention of "the playbook". Give a real reason for Next.js App Router, TypeScript, Tailwind, Prisma, SQLite, and Vitest. List later features: chat, ratings, book photos, real login, campus meetups.

**Mode / Skill:** book-exchange-domain

**Result:** Rewrote the plan in my voice. Must-have stays list, browse/search, propose, accept/decline, cancel, complete, and the ownership swap. Later list is the five features above. Payments and shipping stay out. Trade actors match the domain skill: only the recipient accepts or declines, only the requester cancels a PENDING trade, either party completes an ACCEPTED trade.

**My judgment:** I kept Playwright because M5 still needs one end-to-end trade test, and I wrote a reason for it. I moved real login from "out of scope" to "later" because that is where I was told to put it. I did not add chat, ratings, photos, or meetups to the MVP. I left edit/delete of a reserved book, ISBN format, and genre vocabulary as open questions.

---

### 2026-10-06 · Specs · Phase 3

**Prompt:** Use requirements-engineering, then spec-writer, with book-exchange-domain, to write `specs/product.md`, `specs/requirements.md`, `specs/data-model.md`, `specs/architecture.md`, `specs/api.md`, and `specs/ui.md`. Cross-check them and fix contradictions. Leave anything unresolved under Open Questions.

**Mode / Skill:** requirements-engineering, then spec-writer, with book-exchange-domain.

**Result:** Wrote the six spec files. Must stories are US-01–US-15 and FR-001–FR-016. M1 is FR-001 and FR-002. M2 is FR-003–FR-007. Search, book detail, and trades stay on later milestones. Could-later items are chat, ratings, book photos, real login, and campus meetups. Payments and shipping are Won't.

**My judgment:** I fixed contradictions instead of leaving two answers in place. The reserved-book line now blocks both sides of a new trade, matching FR-011. Propose checks 400, then 404, then 403, then 409, so a missing book is not also a 409. Trade actions check 409 before 403, so a legal action by the wrong person is 403 and an illegal transition is 409. The M1 header does not link to book pages that do not exist yet. I did not silently close these, and they stay under Open Questions: edit or delete of a reserved book; 409 for self-trade and reserved-book proposes (the domain skill only names 409 for illegal transitions); ISBN format; genre list; string length; substring search; blank search returns every book.

---

### 2026-10-06 · Build · /implement-from-spec M1 and M2

**Prompt:** Ali invoked /implement-from-spec. Build v1 only: M1 scaffold and M2 my shelf. Do not build browse/search or trades.

**Mode / Skill:** implement-from-spec, book-exchange-domain. Plan recorded before any application code.

**FRs in this build**

- M1: FR-001 (seed), FR-002 (demo-user switcher). Also NFR-001 and NFR-003, because the seed runs on SQLite and the header has no password field.
- M2: FR-003 (add), FR-004 (edit), FR-005 (delete), FR-006 (my shelf), FR-007 (all books, no search or filter). Also NFR-004 (labels) and NFR-005 (owner comes from the actor, not the form).
- Not in this build: FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, FR-015, FR-016.

**Files I will touch**

- M1: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.env.example`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/actions/session.ts`, `components/header.tsx`, `lib/prisma.ts`, `lib/session.ts`, `lib/books.ts` (condition write used by FR-001-AC3 only), `prisma/schema.prisma`, `prisma/seed.ts`, `tests/global-setup.ts`, `tests/seed.test.ts`, `tests/session.test.ts`.
- M2: `lib/validation.ts`, `lib/books.ts`, `app/actions/books.ts`, `app/page.tsx`, `app/layout.tsx`, `app/shelf/page.tsx`, `app/books/new/page.tsx`, `app/books/[id]/edit/page.tsx`, `components/header.tsx`, `components/book-fields.tsx`, `components/book-form.tsx`, `tests/books.test.ts`, `tests/forms.test.ts`.

**Result:** M1 tests passed before the scaffold commit: 6 passed, 0 failed (`tests/seed.test.ts`, `tests/session.test.ts`). M2 is next.

**My judgment:** I am not building search, filters, book detail, or trades. The Trade model is schema only. Edit and delete will not look at reservations, because that rule is still an open question.
