# Easy Exchange: build tasks

The order of work from plan v2 to the finished app. Each task is one Cursor chat (Agent mode) unless noted. Every task ends the same way: tests pass, `/review`, process-log entry, commit naming the FR IDs.

Status: ✅ done · ⬜ to do

## Phase A: Specs v2 (no code)

| # | Task | Done when |
| --- | --- | --- |
| A1 ✅ | Commit plan v2 and this task list. Log that plan v2 was drafted with Claude Code from my answers. | `docs: plan v2 + tasks` is on `main`. |
| A2 ✅ | Regenerate `specs/` from `docs/plan.md` with `/spec-writer` (and `requirements-engineering`). Keep FR-001–FR-007 IDs; new FRs continue from FR-017. | All 6 spec files match plan v2; traceability table updated; cross-check finds no contradictions. |
| A3 ✅ | Update the skills: `book-exchange-domain` gets categories, jacket condition, the reserved-book edit/delete rule, and an error-code table; `implement-from-spec` ends with traceability + log + commit. | Skills match plan v2 section 6. |

## Phase B: M2.5 Fix-up

| # | Task | Done when |
| --- | --- | --- |
| B1 ✅ | Merge `deploy/vercel` into `main`. Commit the Neon skills (`.agents/`, `.claude/`, `skills-lock.json`) as imported skills. | `main` uses Postgres; Vercel redeploys from `main`. |
| B2 ✅ | Point Vitest at a separate Postgres test database (`TEST_DATABASE_URL`, e.g. a Neon branch), reset before each run. | `npm test` passes on Postgres. |

## Phase C: M3 Catalog pivot

| # | Task | Done when |
| --- | --- | --- |
| C1 ✅ | Schema: Category and JacketCondition enums; Book gets category (replaces genre), publisher, year, edition, outOfPrint, jacketCondition, coverUrl. Migrate. | `prisma migrate` runs cleanly on Neon; types compile. |
| C2 ✅ | Seed the 12 books from plan v2 section 9 with fixed ids. | Seed test checks all 12 books, owners, and categories. |
| C3 ✅ | Cover lookup in `lib/covers.ts`: on create or ISBN change, check Open Library and save `coverUrl` or `null`. | Tests cover found, not found, and Open Library unreachable (book still saves). |
| C4 ✅ | Add/edit forms get every new field with labels; validation for year range and enum values. | Form and validation tests pass; NFR labels test still passes. |
| C5 ✅ | Book cards and shelf show cover or the designed placeholder, with alt text. | No broken images on the live site; placeholder visible on the two seeded books without covers. |

## Phase D: M4 Browse

| # | Task | Done when |
| --- | --- | --- |
| D1 ✅ | Search title/author, case-insensitive (`mode: "insensitive"`). | Tests for match, no match, and mixed case. |
| D2 ✅ | Filters: category, condition, out of print; combinable with search; kept in the URL. | Tests for each filter alone and combined. |
| D3 ✅ | Book detail page `/books/[id]`: cover, every field, owner, 404 page. | Detail and not-found tests pass. |

## Phase E: M5 Trades

| # | Task | Done when |
| --- | --- | --- |
| E1 ⬜ | `lib/trades.ts`: propose in one transaction (reservation check + create). | All propose ACs pass, including reserved, self-trade, not owner, unknown book. |
| E2 ⬜ | Accept, decline, cancel, complete (with ownership swap) + reject every other transition. | Every transition and permission AC passes. |
| E3 ⬜ | Reserved books: block edit and delete with 409. | Edit/delete reserved-book ACs pass. |
| E4 ⬜ | UI: "Propose a trade" on book detail (select one of my unreserved books); `/trades` inbox with Received/Sent and the right buttons per role. Add Trades to the header. | Full swap works by hand on the live site. |

## Phase F: M6 Polish

| # | Task | Done when |
| --- | --- | --- |
| F1 ⬜ | Import a design skill (e.g. a frontend-design skill) and apply it to every page per `specs/ui.md`. Log where it came from. | Pages match the UI spec; works at phone width. |
| F2 ⬜ | Playwright: full swap end to end. | Test passes locally and against the preview deploy. |
| F3 ⬜ | Run `/review-security`; fix or document every finding. | Findings handled in the log. |

## Phase G: M7 Wrap-up

| # | Task | Done when |
| --- | --- | --- |
| G1 ⬜ | README: what it is, live link, run locally, test commands, screenshots. | README on `main`. |
| G2 ⬜ | Final check: all tests, `tsc`, live site swap by hand. Tag `v1.0`. | Every success criterion in plan v2 section 3 met. |
| G3 ⬜ | Presentation from the process log and commit history. | Slides + 2-minute demo ready. |
