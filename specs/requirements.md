# Requirements

Stories, priority, and testable requirements for Easy Exchange, from [docs/plan.md](../docs/plan.md) (plan v2). Product context is in [product.md](product.md). Fields and seed data are in [data-model.md](data-model.md). Actions and error order are in [api.md](api.md). Screens and copy are in [ui.md](ui.md).

## Assumptions

- The actor is the active demo user from the switcher.
- The recipient of a new trade is the current owner of the requested book. The requester is the active user and must own the offered book.
- A book is reserved when it is the offered or requested book on a trade whose status is PENDING or ACCEPTED.
- ISBN is stored as typed, after trimming. The cover lookup removes spaces and hyphens from it to build the URL.
- "Condition" on its own means book condition. Jacket condition is always named in full.

## Constraints

- No money, no shipping, no real accounts.
- Category is exactly one of the 7 values, condition one of 5, jacket condition one of 5 ([data-model.md](data-model.md#enums)).
- A book has one owner. Only that owner edits or deletes it.
- A trade is one of the requester's books for one of the recipient's books. A user can't trade with themselves.
- Allowed transitions: PENDING → ACCEPTED, PENDING → DECLINED, PENDING → CANCELLED, ACCEPTED → COMPLETED. Any other transition is 409.
- Only the recipient accepts or declines. Only the requester cancels, and only while PENDING. Either party completes an ACCEPTED trade.
- A reserved book can't be offered or requested in another trade, edited, or deleted.
- On COMPLETED, the offered book's owner becomes the recipient and the requested book's owner becomes the requester.
- Stack: Next.js App Router, server actions, rules in `lib/`, Prisma, Neon Postgres, Vercel (plan v2 section 8).

## Out of scope

- Won't: payments, shipping, selling.
- Could (later): owner photo uploads, multi-book offers, chat, ratings, real login, campus meetups.

## User stories

US-01 to US-07 are kept from v1 and updated for plan v2. US-08 to US-15 (v1) are retired and replaced by US-16 onward.

- **US-01** As a student or collector, I want the app to start with demo users and their books so that I can try a swap without creating an account.
- **US-02** As a user, I want to switch which demo user I am so that I can act as the other person in a trade.
- **US-03** As a user, I want to add a book I own so that others can see it.
- **US-04** As a user, I want to edit a book I own so that the listing stays accurate.
- **US-05** As a user, I want to delete a book I own so that I can take it off the exchange.
- **US-06** As a user, I want to see my shelf so that I know which books I have listed.
- **US-07** As a user, I want to see every listed book so that I can find books I don't own.
- **US-16** As Lena, I want every book to have one of a fixed set of categories so that I can browse a consistent catalog.
- **US-17** As Marcus, I want each listing to show publisher, year, edition, and out-of-print status so that I can judge a book's value before trading.
- **US-18** As Marcus, I want each listing to show the jacket condition so that I can tell a clean first edition from a worn one.
- **US-19** As a user, I want the app to find the cover from the ISBN so that my listing has an image without uploading one.
- **US-20** As Lena, I want every card and detail page to show a cover or a clear placeholder so that I can recognize books at a glance.
- **US-21** As Lena, I want to search by title or author so that I can find a specific book.
- **US-22** As Lena, I want to filter by category, condition, and out of print so that I see only books that fit my research.
- **US-23** As Marcus, I want a detail page for each book so that I can check every field before proposing.
- **US-24** As a user, I want to offer one of my books for someone else's so that we can swap.
- **US-25** As the recipient, I want to accept a pending trade so that the swap can go ahead.
- **US-26** As the recipient, I want to decline a pending trade so that I keep my book.
- **US-27** As the requester, I want to cancel a pending trade so that I can back out before it's accepted.
- **US-28** As a party to an accepted trade, I want to mark it completed so that the two books change owners.
- **US-29** As the other party, I want a book in an open trade to stay as it was so that I get the book I agreed to.
- **US-30** As a user, I want my trades split into Received and Sent with the right buttons so that I know what needs my answer.
- **US-31** As a user with nothing free to offer, I want "Propose a trade" disabled with a reason so that I'm not surprised by an error.

## MoSCoW

| Priority | Stories | Requirements |
| --- | --- | --- |
| Must | US-01–US-07, US-16–US-29 | FR-001–FR-007, FR-017–FR-032 |
| Should | US-30, US-31 | FR-033, FR-034 |
| Could | none written as stories | Photo uploads, multi-book offers, chat, ratings, real login, campus meetups |
| Won't | none | Payments, shipping, selling |

## Milestones

| Milestone | Requirements |
| --- | --- |
| M1 Scaffold ✅ | FR-001, FR-002 |
| M2 Books ✅ | FR-003–FR-007 |
| M2.5 Deploy & fix-up | NFR-001 |
| M3 Catalog pivot | FR-017–FR-022 (and FR-001, FR-003, FR-004 updated for the new fields) |
| M4 Browse | FR-023–FR-025 |
| M5 Trades | FR-026–FR-034 |
| M6 Polish | NFR-006, NFR-008 |

## Retired IDs

FR-008 to FR-016 were the v1 search, condition filter, book detail, and trade requirements. They were never built. Plan v2 changes them (search no longer covers genre, filters add category and out of print, detail shows the new fields, reserved books are locked), so they are retired and not reused. Their replacements:

| Retired | Replaced by |
| --- | --- |
| FR-008 Search by title, author, or genre | FR-023 |
| FR-009 Filter by condition | FR-024 |
| FR-010 View one book | FR-025 |
| FR-011 Propose a trade | FR-026 |
| FR-012 Accept | FR-027 |
| FR-013 Decline | FR-028 |
| FR-014 Cancel | FR-029 |
| FR-015 Complete | FR-030 |
| FR-016 Reject any other transition | FR-031 |

## Functional requirements

### FR-001 Seed demo data

**US-01.** M1, seed data updated in M3.

- **FR-001-AC1** Given an empty database, When seed runs, Then there are exactly the 3 users and 12 books listed in [data-model.md](data-model.md#seed).
- **FR-001-AC2** Given seed has run, When each book is read, Then it has exactly one owner and its condition is one of NEW, LIKE_NEW, GOOD, FAIR, POOR.
- **FR-001-AC3** Given a condition outside that set, When a book is written, Then the write is rejected and no book is stored.

### FR-002 Switch the active demo user

**US-02.** M1.

- **FR-002-AC1** Given the seeded users, When the header is rendered, Then it shows Maya Chen, Jordan Hale, and Sam Rivera, and it does not show a password field.
- **FR-002-AC2** Given Maya Chen is active, When I switch to Jordan Hale, Then the active user is Jordan Hale the next time it is read.
- **FR-002-AC3** Given Maya Chen is active, When I switch to an id that is not a seeded user, Then the result is 404 and Maya Chen stays active.

### FR-003 Add a book I own

**US-03.** M2, fields updated in M3. The full field list and its validation are FR-017–FR-019.

- **FR-003-AC1** Given I am Maya Chen, When I submit a non-empty title, author, ISBN, category, and condition GOOD, Then the book is stored with Maya Chen as its only owner.
- **FR-003-AC2** Given I am Maya Chen, When I submit a title that is empty or only spaces, Then the result is 400 and no book is created.
- **FR-003-AC3** Given I am Maya Chen, When I submit condition USED, Then the result is 400 and no book is created.

### FR-004 Edit a book I own

**US-04.** M2, fields updated in M3. Reserved books are FR-032.

- **FR-004-AC1** Given I own the book, When I change the title to a non-empty value, Then the stored title changes and the owner is unchanged.
- **FR-004-AC2** Given I do not own the book, When I change the title, Then the result is 403 and the title is unchanged.
- **FR-004-AC3** Given the book id does not exist, When I edit it, Then the result is 404.
- **FR-004-AC4** Given I own the book, When I set the condition to USED, Then the result is 400 and the condition is unchanged.

### FR-005 Delete a book I own

**US-05.** M2. Reserved books are FR-032.

- **FR-005-AC1** Given I own the book, When I delete it, Then it is no longer stored.
- **FR-005-AC2** Given I do not own the book, When I delete it, Then the result is 403 and the book remains.
- **FR-005-AC3** Given the book id does not exist, When I delete it, Then the result is 404.

### FR-006 View my shelf

**US-06.** M2.

- **FR-006-AC1** Given Maya Chen owns book_01 through book_04, When she views her shelf, Then those four books are listed and no book owned by Jordan Hale or Sam Rivera is listed.
- **FR-006-AC2** Given the active user owns no books, When they view their shelf, Then the list is empty.

### FR-007 List every book

**US-07.** M2. With no search text and no filters, Browse (FR-023, FR-024) returns this list.

- **FR-007-AC1** Given the seed, When any user lists every book, Then all 12 books are returned, including books they do not own.
- **FR-007-AC2** Given there are no books, When a user lists every book, Then the list is empty.

### FR-017 Category

**US-16.** M3.

- **FR-017-AC1** Given I am Maya Chen, When I add a book with category EXHIBITION_CATALOGUE, Then the stored book has category EXHIBITION_CATALOGUE.
- **FR-017-AC2** Given I am Maya Chen, When I add or edit a book with category FICTION, Then the result is 400 and nothing is written.
- **FR-017-AC3** Given I am Maya Chen, When I add a book with no category, Then the result is 400 and no book is created.

### FR-018 Collector fields: publisher, year, edition, out of print

**US-17.** M3.

- **FR-018-AC1** Given I am Maya Chen, When I add a book with publisher "MIT Press", year 1972, edition "1st ed.", and out of print checked, Then those four values are stored.
- **FR-018-AC2** Given I am Maya Chen, When I add a book with a blank edition and out of print unchecked, Then the book is stored with edition "" and outOfPrint false.
- **FR-018-AC3** Given I am Maya Chen, When I submit a publisher that is empty or only spaces, Then the result is 400 and nothing is written.
- **FR-018-AC4** Given I am Maya Chen, When I submit year 1449, a year after the current year, or a value that is not a whole number, Then the result is 400 and nothing is written.

### FR-019 Jacket condition

**US-18.** M3.

- **FR-019-AC1** Given I am Maya Chen, When I add a book with jacket condition NONE, Then the stored jacket condition is NONE.
- **FR-019-AC2** Given I own a book, When I edit its jacket condition to MINT, Then the result is 400 and the stored jacket condition is unchanged.

### FR-020 Seed the art and architecture catalog

**US-01, US-16, US-17, US-18.** M3.

- **FR-020-AC1** Given seed has run, When the books are read, Then each of book_01–book_12 has the owner, title, author, ISBN, category, publisher, year, edition, out-of-print value, condition, and jacket condition in [data-model.md](data-model.md#seed).
- **FR-020-AC2** Given seed has run, When the covers are read, Then book_08 and book_12 have a null `coverUrl` and the other ten have their Open Library URL.
- **FR-020-AC3** Given seed has already run, When seed runs again, Then there are still exactly 12 books and 3 users.
- **FR-020-AC4** Given a category outside the 7 values, When a book is written, Then the write is rejected and no book is stored.

### FR-021 Cover lookup by ISBN

**US-19.** M3. Uses `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg?default=false`.

- **FR-021-AC1** Given Open Library has a cover for the ISBN, When I add the book, Then `coverUrl` is saved as `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`.
- **FR-021-AC2** Given Open Library answers 404 for the ISBN, When I add the book, Then the book is saved with `coverUrl` null.
- **FR-021-AC3** Given Open Library is unreachable or does not answer within 3 seconds, When I add the book, Then the book is still saved, with `coverUrl` null.
- **FR-021-AC4** Given I own a book, When I change its ISBN, Then the cover is looked up again for the new ISBN and `coverUrl` is replaced with the result.
- **FR-021-AC5** Given I own a book, When I edit it without changing its ISBN, Then Open Library is not called and `coverUrl` is unchanged.

### FR-022 Show the cover or a placeholder

**US-20.** M3.

- **FR-022-AC1** Given a book with a `coverUrl`, When its card or detail page renders, Then it shows an image with that URL and alt text "Cover of {title} by {author}".
- **FR-022-AC2** Given a book with `coverUrl` null, When its card or detail page renders, Then it shows the placeholder with the title and author as text and no `<img>` element.

### FR-023 Search by title or author

**US-21.** M4. Matching is a case-insensitive substring of title or author (Postgres `mode: "insensitive"`).

- **FR-023-AC1** Given the seed, When I search `koolhaas`, Then the results are exactly book_05 and book_06.
- **FR-023-AC2** Given the seed, When I search `wAyS oF sEeInG`, Then the only result is book_03.
- **FR-023-AC3** Given the seed, When I search `zzzz-no-match`, Then the list is empty.
- **FR-023-AC4** Given the seed, When I search with only spaces, Then all 12 books are returned.

### FR-024 Filter by category, condition, and out of print

**US-22.** M4. Filters combine with each other and with search (all must match). They are kept in the URL query string.

- **FR-024-AC1** Given the seed, When I filter by category PHOTOGRAPHY, Then the results are exactly book_04 and book_10.
- **FR-024-AC2** Given the seed, When I filter by condition FAIR, Then the results are exactly book_03 and book_08.
- **FR-024-AC3** Given the seed, When I filter by out of print only, Then the results are exactly book_07 and book_08.
- **FR-024-AC4** Given the seed, When I search `koolhaas` and filter by category ARCHITECTURAL_THEORY, Then the only result is book_06.
- **FR-024-AC5** Given the seed, When I filter by category ARCHITECTURAL_THEORY, condition FAIR, and out of print only, Then the only result is book_08.
- **FR-024-AC6** Given a category or condition that is not one of the enum values, When I filter by it, Then the result is 400.
- **FR-024-AC7** Given the URL `/?q=koolhaas&category=ARCHITECTURAL_THEORY&oop=1`, When the page loads, Then the search box, category select, and out-of-print checkbox show those values, and the results are filtered by them.

### FR-025 Book detail

**US-23.** M4.

- **FR-025-AC1** Given a seeded book, When I open `/books/{id}`, Then I see its cover or placeholder, title, author, ISBN, category, publisher, year, edition, out of print, condition, jacket condition, and owner's name.
- **FR-025-AC2** Given an id that is not a book, When I open `/books/{id}`, Then the response is 404 and the page says "That book is not listed."

### FR-026 Propose a trade

**US-24.** M5. The reservation check and the create run in one database transaction.

- **FR-026-AC1** Given Maya owns book A and Jordan owns book B, and neither is reserved, When Maya proposes A for B, Then the trade is PENDING, Maya is the requester, Jordan is the recipient, the offered book is A, the requested book is B, and both books are reserved.
- **FR-026-AC2** Given Maya does not own the offered book, When she proposes it, Then the result is 403 and no trade is created.
- **FR-026-AC3** Given Maya proposes one of her books for another of her books, When she submits, Then the result is 409 and no trade is created.
- **FR-026-AC4** Given book A is on a PENDING or ACCEPTED trade, and the actor owns the offered book and not the requested book, When the actor offers A or requests A, Then the result is 409 and no trade is created.
- **FR-026-AC5** Given the offered or requested book id does not exist, When Maya proposes, Then the result is 404 and no trade is created.
- **FR-026-AC6** Given the offered and requested book ids are the same, or either is missing, When Maya proposes, Then the result is 400 and no trade is created.
- **FR-026-AC7** Given two proposals that request the same unreserved book are sent at the same moment, When both run, Then exactly one trade is created and the other result is 409.

### FR-027 Accept a pending trade

**US-25.** M5.

- **FR-027-AC1** Given a PENDING trade, When the recipient accepts, Then the status is ACCEPTED and both books stay reserved.
- **FR-027-AC2** Given a PENDING trade, When the requester or a third user accepts, Then the result is 403 and the status stays PENDING.
- **FR-027-AC3** Given an unknown trade id, When anyone accepts it, Then the result is 404.

### FR-028 Decline a pending trade

**US-26.** M5.

- **FR-028-AC1** Given a PENDING trade, When the recipient declines, Then the status is DECLINED, neither book is reserved, and owners are unchanged.
- **FR-028-AC2** Given a PENDING trade, When the requester declines, Then the result is 403 and the status stays PENDING.

### FR-029 Cancel a pending trade

**US-27.** M5.

- **FR-029-AC1** Given a PENDING trade, When the requester cancels, Then the status is CANCELLED, neither book is reserved, and owners are unchanged.
- **FR-029-AC2** Given a PENDING trade, When the recipient cancels, Then the result is 403 and the status stays PENDING.
- **FR-029-AC3** Given an ACCEPTED trade, When the requester cancels, Then the result is 409 and the status stays ACCEPTED.

### FR-030 Complete an accepted trade

**US-28.** M5.

- **FR-030-AC1** Given an ACCEPTED trade, When the requester completes it, Then the status is COMPLETED, the offered book's owner is the recipient, the requested book's owner is the requester, and neither book is reserved.
- **FR-030-AC2** Given an ACCEPTED trade, When the recipient completes it, Then the same swap happens.
- **FR-030-AC3** Given an ACCEPTED trade, When a user who is neither party completes it, Then the result is 403 and status and owners are unchanged.
- **FR-030-AC4** Given a PENDING trade, When a party completes it, Then the result is 409 and status and owners are unchanged.

### FR-031 Reject any other transition

**US-25–US-28.** M5. Catches every transition that isn't one of the four allowed.

- **FR-031-AC1** Given a COMPLETED trade, When a party accepts, declines, cancels, or completes it, Then each result is 409 and the status stays COMPLETED.
- **FR-031-AC2** Given a DECLINED or CANCELLED trade, When a party accepts, declines, cancels, or completes it, Then each result is 409 and the status is unchanged.
- **FR-031-AC3** Given an ACCEPTED trade, When the recipient accepts or declines it, Then the result is 409 and the status stays ACCEPTED.

### FR-032 Reserved books can't be edited or deleted

**US-29.** M5.

- **FR-032-AC1** Given I own a book on a PENDING or ACCEPTED trade, When I edit it, Then the result is 409 and every stored field is unchanged.
- **FR-032-AC2** Given I own a book on a PENDING or ACCEPTED trade, When I delete it, Then the result is 409 and the book remains.
- **FR-032-AC3** Given my book's only trade is DECLINED, CANCELLED, or COMPLETED, When I edit or delete it, Then it succeeds. A deleted book's closed trades are deleted with it.

### FR-033 Trades inbox: Received and Sent

**US-30.** M5. Should.

- **FR-033-AC1** Given Maya proposed a trade to Jordan, When Jordan opens `/trades`, Then the trade is under Received, with Accept and Decline, and no Cancel.
- **FR-033-AC2** Given the same trade, When Maya opens `/trades`, Then it is under Sent, with Cancel, and no Accept or Decline.
- **FR-033-AC3** Given an ACCEPTED trade, When either party opens `/trades`, Then it shows "Mark completed" and no other action.
- **FR-033-AC4** Given Sam is neither party, When Sam opens `/trades`, Then the trade is not listed.
- **FR-033-AC5** Given a DECLINED, CANCELLED, or COMPLETED trade, When either party opens `/trades`, Then it is listed with its status and no action buttons.

### FR-034 Disable "Propose a trade" when I have nothing to offer

**US-31.** M5. Should.

- **FR-034-AC1** Given I have at least one unreserved book, When I open another user's book, Then "Propose a trade" is enabled and its select lists only my unreserved books.
- **FR-034-AC2** Given I have no unreserved books, When I open another user's book, Then "Propose a trade" is disabled and the page says "You have no books free to offer. Add a book or wait for one of your trades to close."

## Non-functional requirements

- **NFR-001** Data lives in Neon Postgres through Prisma, with schema changes as Prisma migrations. `npm test` runs against a separate Postgres test database named by `TEST_DATABASE_URL`, reset before each run, and never against `DATABASE_URL`.
- **NFR-002** TypeScript strict mode is on. `npx tsc --noEmit` exits 0.
- **NFR-003** The app has no password field, no sign-up form, and no login request. The active demo user is the only actor.
- **NFR-004** The switcher, the add-book form, the edit-book form, the browse filters, and the propose form expose a visible `<label>` tied to every control with `htmlFor`.
- **NFR-005** Create and edit ignore any owner id or cover URL sent by the client.
- **NFR-006** Every page is usable at 375 px wide with no horizontal scrolling.
- **NFR-007** Open Library is called only when a book is added or its ISBN changes, never on page view. A lookup waits at most 3 seconds.
- **NFR-008** One Playwright test runs the full swap: switch user, propose, switch, accept, complete, check both shelves.
- **NFR-009** Every book image has alt text "Cover of {title} by {author}". No page renders a broken image.

## Traceability

| Story | Requirement | Acceptance criteria | Test |
| --- | --- | --- | --- |
| US-01 | FR-001 | AC1–AC3 | `tests/seed.test.ts` |
| US-02 | FR-002, NFR-003 | AC1–AC3 | `tests/session.test.ts` |
| US-03 | FR-003, NFR-005 | AC1–AC3 | `tests/books.test.ts` |
| US-04 | FR-004, NFR-005 | AC1–AC4 | `tests/books.test.ts` |
| US-05 | FR-005 | AC1–AC3 | `tests/books.test.ts` |
| US-06 | FR-006 | AC1–AC2 | `tests/books.test.ts` |
| US-07 | FR-007 | AC1–AC2 | `tests/books.test.ts` |
| US-03, US-04 | NFR-004 | Labels on every control | `tests/forms.test.ts` |
| US-01 | NFR-001 | Postgres test database, migrations | `tests/global-setup.ts` (`prisma migrate deploy`), `tests/db.test.ts` |
| all | NFR-002 | `tsc --noEmit` exits 0 | `npx tsc --noEmit` |
| US-16 | FR-017 | AC1–AC3 | `tests/catalog.test.ts` |
| US-17 | FR-018 | AC1–AC4 | `tests/catalog.test.ts` |
| US-18 | FR-019 | AC1–AC2 | `tests/catalog.test.ts` |
| US-01 | FR-020 | AC1–AC4 | `tests/seed.test.ts` |
| US-19 | FR-021, NFR-007 | AC1–AC5 | `tests/covers.test.ts` |
| US-20 | FR-022, NFR-009 | AC1–AC2 | `tests/cover-image.test.ts` |
| US-21 | FR-023 | AC1–AC4 | `tests/browse.test.ts` |
| US-22 | FR-024 | AC1–AC7 | `tests/browse.test.ts` |
| US-23 | FR-025 | AC1–AC2 | `tests/detail.test.ts` |
| US-24 | FR-026 | AC1–AC7 | `tests/trades.test.ts` |
| US-25 | FR-027 | AC1–AC3 | `tests/trades.test.ts` |
| US-26 | FR-028 | AC1–AC2 | `tests/trades.test.ts` |
| US-27 | FR-029 | AC1–AC3 | `tests/trades.test.ts` |
| US-28 | FR-030 | AC1–AC4 | `tests/trades.test.ts` |
| US-25–US-28 | FR-031 | AC1–AC3 | `tests/trades.test.ts` |
| US-29 | FR-032 | AC1–AC3 | `tests/reserved.test.ts` |
| US-30 | FR-033 | AC1–AC5 | `tests/trades-ui.test.ts` |
| US-31 | FR-034 | AC1–AC2 | `tests/trades-ui.test.ts` |
| all | NFR-006 | Phone width | Manual check at 375 px; Playwright viewport |
| US-24–US-28 | NFR-008 | Full swap | `e2e/swap.spec.ts` |

## Open Questions

None open. Answered by Ali on 2026-10-06 (see [docs/process-log.md](../docs/process-log.md), A2):

- Publisher and year are required; year is a whole number from 1450 to the current year; edition is optional.
- Deleting a book deletes its closed trades. Reserved books can't be deleted (FR-032).
- The C1 migration clears all books and trades on the production database; the C2 seed then loads the 12 books.
- FR-008–FR-016 are retired and never reused. New FRs start at FR-017. FR-001–FR-007 keep their IDs; only "genre" became "category".
- The out-of-print filter is a checkbox, "Out of print only". The condition filter uses book condition only.
- Playwright runs locally, then once against the live site. The live run adds its own books and deletes them afterwards.
- The test database is a separate `easy_exchange_test` database in the same Neon project. Seed `coverUrl` values come straight from the plan table.

Choices made in these specs and not stated in the plan, recorded so they can be challenged:

- Propose checks run 400, 404, 403, 409 (carried over from v1). Self-trade and reserved books are 409.
- Trade actions check 404, then 409 (status doesn't allow it), then 403 (wrong person) (carried over from v1).
- Edit checks 404, 403, then 409 (reserved), then 400 (fields). A reserved book is locked whatever the input.
- The cover lookup timeout is 3 seconds.
- ISBN has no format or checksum; only empty is rejected. No maximum string lengths are set.
