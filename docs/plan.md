# Easy Exchange — plan v2

A one-for-one exchange for architecture and art books. Students and collectors swap books they own for books they want. No money changes hands.

Plan v1 (general book exchange) is in git history. What changed and why is at the end of this file.

## 1. Problem & vision

Architecture and art books are expensive, often out of print, and hard to find. A monograph or an exhibition catalogue can cost more used than it did new. Meanwhile, students finish a studio or a seminar and their books sit on a shelf, and collectors hold duplicates or books that no longer fit what they collect.

Easy Exchange connects those shelves. You list a book you own, find a book someone else owns, and propose a straight swap. Every listing shows the cover and the collector details that matter for these books: publisher, year, edition, whether it is out of print, and the condition of the book and its dust jacket.

## 2. Personas

**Primary: Lena, architecture student (24).** In a graduate architecture program. Owns a stack of theory readers and a few monographs from past studios. Wants specific books for her thesis research but can't spend $90 on a used catalogue. Cares about: finding a specific title fast, knowing the condition before she offers anything.

**Secondary: Marcus, designer and collector (38).** Works at a design studio and collects architecture monographs and exhibition catalogues. Has duplicates and books outside his focus. Cares about: edition, out-of-print status, and jacket condition. A first edition with a clean jacket is not the same book as a reprint without one.

Both use the same features. Marcus is the reason the collector fields exist; Lena is the reason search and categories exist.

## 3. Goals & success criteria

| Goal | Measurable success criterion |
| --- | --- |
| A full swap works end to end | On the live site, a user can list a book, a second user can propose a trade, the first accepts, either completes, and both books appear on the other's shelf. One Playwright test covers this flow and passes. |
| Every book has an image | 100% of books render an image: the Open Library cover, or a placeholder when none exists. No broken image icons. |
| Collectors can judge a book before trading | Book detail shows publisher, year, edition, out-of-print status, book condition, and jacket condition for every book. |
| Finding a book is quick | Search by title or author plus filters for category, condition, and out of print. Results update in one page load. |
| The rules can't be broken | Every trade rule in section 6 has a passing automated test, including all failure cases. |
| The process is visible | Every milestone has spec IDs in its commit messages and a process-log entry. |

## 4. Scope (MoSCoW)

**Must (MVP)**
- Seeded demo users and an "Acting as" switcher.
- Add, edit, delete my books; My Shelf; list of all books.
- Book fields: title, author, ISBN, category, publisher, year, edition, out of print, condition, jacket condition.
- Cover image from Open Library by ISBN, with a placeholder fallback.
- Search by title/author; filter by category, condition, out of print.
- Book detail page.
- Propose a 1-for-1 trade, accept, decline, cancel, complete with ownership swap.
- Deployed on Vercel with Neon Postgres.

**Should**
- A Trades inbox split into "Received" and "Sent".
- Disable "Propose a trade" when I have no unreserved books to offer, with a message explaining why.

**Could (later)**
- Owner photo uploads of their actual copy.
- Multi-book offers (two books for one rare one).
- Chat between traders, ratings, real login, campus meetups.

**Won't**
- Payments, shipping, selling.

## 5. Key user flows

### List a book
1. Pick a demo user in the switcher.
2. Add a book: title, author, ISBN, category, publisher, year, edition, out of print, condition, jacket condition.
3. The app looks up the cover by ISBN. If none exists, the book shows a placeholder.
4. The book appears on My Shelf and in Browse. I can edit or delete it while it isn't in an open trade.

### Find and propose
1. Browse or search; filter by category, condition, or out of print.
2. Open a book's detail page to check edition and condition.
3. Click "Propose a trade", choose one of my unreserved books, submit.
4. The trade is PENDING and both books are reserved. I land on Trades with a confirmation.

### Respond and complete
1. The recipient sees the proposal under Received.
2. The recipient accepts or declines. The requester can cancel while it's pending.
3. After they meet up, either party marks it completed.
4. The two books swap owners and both are free to trade again.

## 6. Domain rules

- **Categories (only these):** Architecture Monograph, Architectural Theory, Art History, Exhibition Catalogue, Photography, Design, Artist Book / Zine.
- **Book condition:** New, Like New, Good, Fair, Poor.
- **Jacket condition:** None (no jacket), Poor, Fair, Good, Fine.
- **Ownership:** each book has one owner. Only the owner edits or deletes it.
- **Trades:** one of my books for one of theirs. I can't trade with myself.
- **States:** PENDING → ACCEPTED → COMPLETED, or PENDING → DECLINED, or PENDING → CANCELLED. Any other transition is rejected.
- **Permissions:** only the recipient accepts or declines. Only the requester cancels, and only while pending. Either party completes an accepted trade.
- **Reservations:** a book in a PENDING or ACCEPTED trade is reserved. It can't be offered or requested in another trade, edited, or deleted.
- **Completion:** the two books swap owners.

## 7. Data model sketch

- **User:** id, name.
- **Book:** id, title, author, isbn, category, publisher, year, edition, outOfPrint, condition, jacketCondition, coverUrl (nullable), ownerId.
- **Trade:** id, requesterId, recipientId, offeredBookId, requestedBookId, status, createdAt, updatedAt.

Category, condition, jacket condition, and trade status are enums in the database, not free text.

## 8. Architecture & stack

```
Pages (React Server Components) → server actions → lib/ (rules) → Prisma → Neon Postgres
```

| Choice | Reason |
| --- | --- |
| Next.js App Router | Pages and server logic in one project; pages load data on the server. |
| TypeScript (strict) | The trade rules are strict; a wrong status or missing owner should fail at compile time. |
| Server actions, not a REST API | Only this app calls the backend. Actions keep forms simple and avoid writing a separate API layer. (Decision D3.) |
| `lib/` holds the rules | Business rules live in plain functions that take the acting user as an argument, so tests can call them directly without a browser. |
| Prisma | One typed schema for User, Book, Trade; easy seeding. |
| Neon Postgres | Hosted, free tier, works with Vercel. (Decision D1.) |
| Tailwind | Styling inside components; no separate CSS system for a small app. |
| Vercel | Free hosting for Next.js; every push to `main` redeploys. |
| Vitest + Playwright | Fast rule tests per acceptance criterion; one end-to-end test of the full swap. |

## 9. Image strategy

- **Source:** Open Library Covers, `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg?default=false`. Free, no API key.
- **When:** the cover URL is checked when a book is added or its ISBN changes, and saved to `coverUrl`. A 404 saves `null`.
- **Fallback:** books with no cover show a designed placeholder with the title and author, not a broken image.
- **Accessibility:** every image has alt text: "Cover of {title} by {author}".
- **Not in MVP:** owner photo uploads (Could). They need file storage, size limits, and moderation.

### Seed catalog

Twelve real books, every ISBN checked against Open Library on 2026-10-06. Ten have covers. Two don't, on purpose, so the placeholder is visible in the demo.

| Owner | Title | Author | Publisher, year | Edition | ISBN | Category | Cover |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Maya Chen | Toward an Architecture | Le Corbusier | Getty Research Institute, 2007 | — | 0892368225 | Architectural Theory | ✅ |
| Maya Chen | Thinking with Type | Ellen Lupton | Princeton Architectural Press, 2010 | 2nd rev. ed. | 1568989695 | Design | ✅ |
| Maya Chen | Ways of Seeing | John Berger | Penguin, 1990 | — | 0140135154 | Art History | ✅ |
| Maya Chen | On Photography | Susan Sontag | Picador, 2001 | — | 0312420099 | Photography | ✅ |
| Jordan Hale | S, M, L, XL | Rem Koolhaas, Bruce Mau | Monacelli Press, 1995 | 1st ed. | 1885254016 | Architecture Monograph | ✅ |
| Jordan Hale | Delirious New York | Rem Koolhaas | Monacelli Press, 1994 | New ed. | 1885254008 | Architectural Theory | ✅ |
| Jordan Hale | Deconstructivist Architecture | Philip Johnson, Mark Wigley | Museum of Modern Art, 1988 | 1st ed. | 087070298X | Exhibition Catalogue | ✅ |
| Jordan Hale | Learning from Las Vegas | Robert Venturi, Denise Scott Brown, Steven Izenour | MIT Press, 1972 | 1st ed. | 0262220156 | Architectural Theory | ❌ placeholder |
| Sam Rivera | The Story of Art | E. H. Gombrich | Phaidon, 1995 | 16th ed. | 0714832472 | Art History | ✅ |
| Sam Rivera | Uncommon Places | Stephen Shore | Aperture, 2005 | Revised ed. | 1931788340 | Photography | ✅ |
| Sam Rivera | Grid Systems in Graphic Design | Josef Müller-Brockmann | Niggli, 1996 | 4th rev. ed. | 3721201450 | Design | ✅ |
| Sam Rivera | Twentysix Gasoline Stations | Michalis Pichler | Printed Matter, 2009 | — | 0894390449 | Artist Book / Zine | ❌ placeholder |

Condition, jacket condition, and out-of-print values for each copy are set in `specs/data-model.md`. The 1972 *Learning from Las Vegas* and the MoMA catalogue are marked out of print.

## 10. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Open Library has no cover for many niche books | Designed placeholder; seed list chosen with covers checked; photo uploads as a later feature. |
| Open Library is slow or down | Look the cover up only when a book is saved, not on every page view; save the URL. |
| Two people propose trades for the same book at the same moment | Check the reservation and create the trade in one database transaction. |
| A book in an open trade gets edited or deleted | Rejected while reserved (section 6). |
| Demo users aren't real accounts | Acceptable for a class demo; all data is fake. Real login is listed under Could. |
| Tests drifted when the database moved to Postgres | Tests run against a separate Postgres test database before M3 starts. |
| The AI builds beyond the spec | Specs list the FR IDs per milestone; `implement-from-spec` must report gaps instead of deciding them. |

## 11. Decisions

**D1. SQLite → Neon Postgres.**
Context: v1 used a SQLite file for zero setup. Vercel doesn't keep files between requests, so writes would be lost.
Options: stay on SQLite and host elsewhere; Turso; Neon Postgres.
Decision: Neon Postgres through the Vercel integration.
Consequence: one-click setup and a free tier. Tests need a Postgres test database, and search must be case-insensitive explicitly.

**D2. Niche pivot to architecture and art books.**
Context: a general book exchange competes with every textbook swap and doesn't need anything special.
Decision: focus on architecture and art books.
Consequence: new fields (publisher, year, edition, out of print, jacket condition), fixed categories, and a new seed. The trade rules are unchanged.

**D3. Server actions instead of a REST API.**
Context: only this app's pages call the backend.
Decision: Next.js server actions, with the rules in `lib/`.
Consequence: less code and simpler forms. If a mobile app or third party ever needs the data, a REST layer can call the same `lib/` functions.

**D4. Covers from Open Library; uploads later.**
Context: every book should have an image, but uploads need storage, limits, and moderation.
Decision: automatic covers by ISBN with a placeholder fallback.
Consequence: no storage costs or upload code in the MVP. Some niche books will show the placeholder.

**D5. Demo users instead of real login.**
Context: login isn't what this project demonstrates, and it adds password and security work.
Decision: three seeded users and a switcher.
Consequence: anyone can act as anyone. Fine for a demo; listed under Could.

**D6. Trades stay 1-for-1.**
Context: rare books might be worth two common ones.
Decision: keep 1-for-1 for the MVP.
Consequence: simpler rules and UI. Multi-book offers are listed under Could.

## 12. Milestones

| Milestone | Scope | Definition of done |
| --- | --- | --- |
| M1 Scaffold ✅ | App shell, schema, seed, switcher | Done (FR-001, FR-002). |
| M2 Books ✅ | Add, edit, delete, My Shelf, All books | Done (FR-003–FR-007). |
| M2.5 Deploy & fix-up ✅/⬜ | Neon Postgres, Vercel, tests on Postgres | Live on Vercel ✅. `deploy/vercel` merged to `main`; `npm test` passes against a Postgres test database. |
| M3 Catalog pivot | New fields, categories, covers, new seed | Schema migrated; add/edit forms have every new field with labels; 12 real art/architecture books seeded; covers or placeholders render on every card; tests for each new FR pass. |
| M4 Browse | Search, filters, book detail | Search by title/author; filters for category, condition, out of print; detail page shows every field; case-insensitive search tested. |
| M5 Trades | Propose, accept, decline, cancel, complete | Every trade rule and failure case has a passing test; reserved books can't be edited, deleted, or double-traded; Trades inbox works for both parties. |
| M6 Polish | Design pass, end-to-end test | UI matches `specs/ui.md`; imported design skill applied; the Playwright full-swap test passes; `/review` and `/review-security` findings handled. |
| M7 Wrap-up | Final deploy and docs | `main` deployed; README with the live link and how to run locally; process log complete. |

Each milestone is its own Cursor chat, uses `/implement-from-spec`, runs `/review`, and ends with a commit that names its FR IDs.

## 13. Testing strategy

- **Rule tests (Vitest):** one test per acceptance criterion, calling `lib/` functions directly with an actor id. They run against a separate Postgres test database that is reset before each run.
- **End-to-end (Playwright):** one test of the full swap on a running app: switch user, propose, switch, accept, complete, check both shelves.
- **Type check:** `npx tsc --noEmit` passes.
- **Review:** Cursor `/review` after each milestone; `/review-security` once in M6.
- **Manual check:** after each deploy, open the live site and run the swap by hand.

## Changes from v1

| Change | Why |
| --- | --- |
| General books → architecture and art books | A distinct product with real needs (D2). |
| Free-text genre → fixed categories | Consistent browsing and filtering for a niche catalog. |
| Added publisher, year, edition, out of print, jacket condition | These details decide a collectible book's value. |
| Book covers moved from "Later" into the MVP | Visual books need images; covers come free by ISBN (D4). |
| SQLite → Neon Postgres, deployed on Vercel | Needed to deploy (D1). |
| Reserved books can't be edited or deleted | v1 left this open; editing a book mid-trade would change what the other person agreed to. |
| Added a collector persona, success criteria, decisions, definition of done, testing strategy | v1 didn't have them; they make the plan checkable. |
