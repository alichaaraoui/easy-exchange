# Requirements

Stories, priority, and testable requirements for Easy Exchange. Product context is in [product.md](product.md). Domain rules for condition, ownership, and trades are applied here and not restated as new features. Data fields are in [data-model.md](data-model.md). Actions are in [api.md](api.md). Screens are in [ui.md](ui.md).

## Assumptions

- The actor is the active demo user from the switcher.
- The recipient of a new trade is the current owner of the requested book. The requester is the active user and must own the offered book.
- A book is reserved when it is the offered book or the requested book on a trade whose status is PENDING or ACCEPTED.
- Title, author, ISBN, condition, and genre are all required to add or edit a book.
- ISBN is stored as typed, after trimming. Genre is free text, after trimming.

## Constraints

- No money, no shipping, no real accounts in the MVP.
- Condition is exactly one of NEW, LIKE_NEW, GOOD, FAIR, POOR.
- A book has one owner. Only that owner edits or deletes it.
- A trade offers one of the requester's books for one of the recipient's books.
- Allowed transitions: PENDING → ACCEPTED, PENDING → DECLINED, PENDING → CANCELLED, ACCEPTED → COMPLETED. Any other transition is rejected with 409.
- On accept, decline, cancel, and complete, the checks run in this order: missing trade is 404, a status that does not allow that transition is 409, then the wrong person is 403. See [api.md](api.md).
- Only the recipient accepts or declines. Only the requester cancels a PENDING trade. Either party marks an ACCEPTED trade COMPLETED.
- A reserved book cannot be the offered book or the requested book on a new trade.
- A user cannot trade with themselves.
- On COMPLETED, the offered book's owner becomes the recipient, and the requested book's owner becomes the requester.

## Out of scope

- Payments and shipping (will not do).
- Chat, ratings, book photos, real login, campus meetups (later, not this MVP).

## User stories

Each story is one student goal, small enough to test on its own.

- **US-01** As a student, I want the app to start with demo users and their books so that I can try a swap without creating an account.
- **US-02** As a student, I want to switch which demo user I am so that I can act as the other person in a trade.
- **US-03** As a student, I want to add a book I own so that other students can see it.
- **US-04** As a student, I want to edit a book I own so that the listing stays accurate.
- **US-05** As a student, I want to delete a book I own so that I can take it off the exchange.
- **US-06** As a student, I want to see my shelf so that I know which books I have listed.
- **US-07** As a student, I want to see every listed book so that I can find books I do not own.
- **US-08** As a student, I want to search by title, author, or genre so that I can find a specific book.
- **US-09** As a student, I want to filter by condition so that I can skip copies that are too worn for me.
- **US-10** As a student, I want to open one book so that I can read its title, author, ISBN, condition, genre, and owner before I propose a trade.
- **US-11** As a student, I want to propose one of my books for one of theirs so that we can swap.
- **US-12** As the recipient, I want to accept a pending trade so that the swap can go ahead.
- **US-13** As the recipient, I want to decline a pending trade so that I keep my book.
- **US-14** As the requester, I want to cancel a pending trade so that I can back out before it is accepted.
- **US-15** As a party to an accepted trade, I want to mark it completed so that the two books change owners.

## MoSCoW

| Priority | Stories | Notes |
| --- | --- | --- |
| Must | US-01–US-15 | MVP. Only these become FR items below. |
| Should | None | I am not adding a second tier. |
| Could | None of the stories above | Later, not stories yet: chat, ratings, book photos, real login, campus meetups. |
| Won't | None of the stories above | Payments and shipping. |

M1 implements FR-001 and FR-002. M2 implements FR-003 through FR-007. M3 implements FR-008 through FR-010. M4 implements FR-011 through FR-016.

## Functional requirements

### FR-001 Seed demo data

**US-01.** Milestone M1.

- **FR-001-AC1** Given an empty database, When seed runs, Then there are exactly the 3 users and 12 books listed in [data-model.md](data-model.md).
- **FR-001-AC2** Given seed has run, When each book is read, Then it has exactly one owner and its condition is one of NEW, LIKE_NEW, GOOD, FAIR, POOR.
- **FR-001-AC3** Given a condition outside that set, When a book is written, Then the write is rejected and no book is stored.

### FR-002 Switch the active demo user

**US-02.** Milestone M1.

- **FR-002-AC1** Given the seeded users, When the header is rendered, Then it shows Maya Chen, Jordan Hale, and Sam Rivera, and it does not show a password field.
- **FR-002-AC2** Given Maya Chen is active, When I switch to Jordan Hale, Then the active user is Jordan Hale the next time it is read.
- **FR-002-AC3** Given Maya Chen is active, When I switch to an id that is not a seeded user, Then the result is 404 and Maya Chen stays active.

### FR-003 Add a book I own

**US-03.** Milestone M2.

- **FR-003-AC1** Given I am Maya Chen, When I submit a non-empty title, author, ISBN, genre, and condition GOOD, Then the book is stored with Maya Chen as its only owner.
- **FR-003-AC2** Given I am Maya Chen, When I submit a title that is empty or only spaces, Then the result is 400 and no book is created.
- **FR-003-AC3** Given I am Maya Chen, When I submit condition USED, Then the result is 400 and no book is created.

### FR-004 Edit a book I own

**US-04.** Milestone M2.

- **FR-004-AC1** Given I own the book, When I change the title to a non-empty value, Then the stored title changes and the owner is unchanged.
- **FR-004-AC2** Given I do not own the book, When I change the title, Then the result is 403 and the title is unchanged.
- **FR-004-AC3** Given the book id does not exist, When I edit it, Then the result is 404.
- **FR-004-AC4** Given I own the book, When I set the condition to USED, Then the result is 400 and the condition is unchanged.

### FR-005 Delete a book I own

**US-05.** Milestone M2.

- **FR-005-AC1** Given I own the book, When I delete it, Then it is no longer stored.
- **FR-005-AC2** Given I do not own the book, When I delete it, Then the result is 403 and the book remains.
- **FR-005-AC3** Given the book id does not exist, When I delete it, Then the result is 404.

### FR-006 View my shelf

**US-06.** Milestone M2.

- **FR-006-AC1** Given Maya Chen owns book_01 through book_04, When she views her shelf, Then those four books are listed and no book owned by Jordan Hale or Sam Rivera is listed.
- **FR-006-AC2** Given the active user owns no books, When they view their shelf, Then the list is empty.

### FR-007 List every book

**US-07.** Milestone M2. This list has no search text and no condition filter. Search and filter are FR-008 and FR-009.

- **FR-007-AC1** Given the seed, When any user lists every book, Then all 12 books are returned, including books they do not own.
- **FR-007-AC2** Given there are no books, When a user lists every book, Then the list is empty.

### FR-008 Search by title, author, or genre

**US-08.** Milestone M3.

- **FR-008-AC1** Given the seed, When I search `clean`, Then the only result is book_01 (Clean Code). Matching is a case-insensitive substring of title, author, or genre.
- **FR-008-AC2** Given the seed, When I search `zzzz-no-match`, Then the list is empty.
- **FR-008-AC3** Given the seed, When I search with only spaces, Then the result is the full list of books.

### FR-009 Filter by condition

**US-09.** Milestone M3.

- **FR-009-AC1** Given the seed, When I filter by GOOD, Then every returned book has condition GOOD and no FAIR book is included.
- **FR-009-AC2** Given the seed, When I filter by USED, Then the result is 400.
- **FR-009-AC3** Given a search and a valid condition, When I apply both, Then a book must match the search and the condition.

### FR-010 View one book

**US-10.** Milestone M3.

- **FR-010-AC1** Given a seeded book, When I open it, Then I get its title, author, ISBN, condition, genre, and owner's name.
- **FR-010-AC2** Given an id that is not a book, When I open it, Then the result is 404.

### FR-011 Propose a trade

**US-11.** Milestone M4.

- **FR-011-AC1** Given Maya Chen owns book A and Jordan Hale owns book B, and neither book is reserved, When Maya proposes A for B, Then the trade is PENDING, Maya is the requester, Jordan is the recipient, the offered book is A, the requested book is B, and both books are reserved.
- **FR-011-AC2** Given Maya does not own the offered book, When she proposes it, Then the result is 403 and no trade is created.
- **FR-011-AC3** Given Maya proposes one of her books for another of her books, When she submits, Then the result is 409 and no trade is created.
- **FR-011-AC4** Given book A is already on a PENDING or ACCEPTED trade, and the actor owns the offered book and does not own the requested book, When the actor offers A or requests A, Then the result is 409 and no trade is created.
- **FR-011-AC5** Given the requested book id does not exist, When Maya proposes a trade for it, Then the result is 404 and no trade is created.
- **FR-011-AC6** Given the offered book id and the requested book id are the same, When Maya proposes that trade, Then the result is 400 and no trade is created.

### FR-012 Accept a pending trade

**US-12.** Milestone M4.

- **FR-012-AC1** Given a PENDING trade, When the recipient accepts, Then the status is ACCEPTED and both books stay reserved.
- **FR-012-AC2** Given a PENDING trade, When the requester accepts, Then the result is 403 and the status stays PENDING.
- **FR-012-AC3** Given a trade that is not PENDING, When the recipient accepts, Then the result is 409 and the status is unchanged.

### FR-013 Decline a pending trade

**US-13.** Milestone M4.

- **FR-013-AC1** Given a PENDING trade, When the recipient declines, Then the status is DECLINED and neither book is reserved.
- **FR-013-AC2** Given a PENDING trade, When the requester declines, Then the result is 403 and the status stays PENDING.
- **FR-013-AC3** Given a trade that is not PENDING, When the recipient declines, Then the result is 409 and the status is unchanged.

### FR-014 Cancel a pending trade

**US-14.** Milestone M4.

- **FR-014-AC1** Given a PENDING trade, When the requester cancels, Then the status is CANCELLED and neither book is reserved.
- **FR-014-AC2** Given a PENDING trade, When the recipient cancels, Then the result is 403 and the status stays PENDING.
- **FR-014-AC3** Given a trade that is not PENDING, When the requester cancels, Then the result is 409 and the status is unchanged.

### FR-015 Complete an accepted trade

**US-15.** Milestone M4.

- **FR-015-AC1** Given an ACCEPTED trade, When the requester or the recipient completes it, Then the status is COMPLETED, the offered book's owner is the recipient, the requested book's owner is the requester, and neither book is reserved.
- **FR-015-AC2** Given an ACCEPTED trade, When a user who is neither party completes it, Then the result is 403 and the owners stay the same.
- **FR-015-AC3** Given a trade that is not ACCEPTED, When a party completes it, Then the result is 409 and the owners stay the same.

### FR-016 Reject any other transition

**US-12, US-13, US-14, US-15.** Milestone M4. This is the catch-all for transitions that are not PENDING → ACCEPTED, PENDING → DECLINED, PENDING → CANCELLED, or ACCEPTED → COMPLETED.

- **FR-016-AC1** Given a COMPLETED trade, When a party accepts, declines, cancels, or completes it again, Then the result is 409 and the status stays COMPLETED.
- **FR-016-AC2** Given a CANCELLED or DECLINED trade, When a party accepts it, Then the result is 409 and the status is unchanged.

## Non-functional requirements

Vague targets such as "fast" or "easy" are not used.

- **NFR-001** The database is a local SQLite file. The app does not require a hosted database to seed or to read books.
- **NFR-002** TypeScript strict mode is on. `npx tsc --noEmit` exits 0 for the app.
- **NFR-003** The MVP has no password field, no account-creation form, and no login request. The active demo user is the only actor.
- **NFR-004** The user switcher, the add-book form, and the edit-book form each expose a visible `<label>` tied to every control with `htmlFor`.
- **NFR-005** Create and edit ignore any owner id sent by the client. The owner is the active user on create, and edit does not change the owner.

## Traceability

| Story | Requirement | Acceptance criteria | Test |
| --- | --- | --- | --- |
| US-01 | FR-001 | FR-001-AC1, AC2, AC3 | `tests/seed.test.ts` |
| US-02 | FR-002 | FR-002-AC1, AC2, AC3 | `tests/session.test.ts` |
| US-02 | NFR-003 | No password control | `tests/session.test.ts` (FR-002-AC1) |
| US-03 | FR-003, NFR-005 | FR-003-AC1, AC2, AC3 | `tests/books.test.ts` |
| US-04 | FR-004, NFR-005 | FR-004-AC1, AC2, AC3, AC4 | `tests/books.test.ts` |
| US-05 | FR-005 | FR-005-AC1, AC2, AC3 | `tests/books.test.ts` |
| US-06 | FR-006 | FR-006-AC1, AC2 | `tests/books.test.ts` |
| US-07 | FR-007 | FR-007-AC1, AC2 | `tests/books.test.ts` |
| US-03, US-04 | NFR-004 | Labels on add and edit | `tests/forms.test.ts` |
| US-01 | NFR-001 | SQLite file used by seed | `tests/seed.test.ts` |
| US-01 | NFR-002 | `tsc --noEmit` exits 0 | `npx tsc --noEmit` (not a Vitest case) |
| US-08 | FR-008 | FR-008-AC1, AC2, AC3 | M3, not written |
| US-09 | FR-009 | FR-009-AC1, AC2, AC3 | M3, not written |
| US-10 | FR-010 | FR-010-AC1, AC2 | M3, not written |
| US-11 | FR-011 | FR-011-AC1–AC6 | M4, not written |
| US-12 | FR-012, FR-016 | FR-012-AC1–AC3, FR-016-AC1, AC2 | M4, not written |
| US-13 | FR-013 | FR-013-AC1–AC3 | M4, not written |
| US-14 | FR-014 | FR-014-AC1–AC3 | M4, not written |
| US-15 | FR-015 | FR-015-AC1–AC3 | M4, not written |

## Open Questions

- I have not decided whether the owner can edit or delete a book that is reserved. [api.md](api.md) does not check trades on edit or delete. That is unfinished, not a rule that reserved books may be changed.
- The domain skill names 409 for an illegal transition. It does not name the status for a self-trade or for offering a reserved book. I use 409 for both in FR-011 so those failures are conflicts. I am not treating that code as something the domain skill already stated.
- ISBN has no format or checksum. I only reject an empty value.
- Genre has no fixed list.
- I have not set a maximum length for title, author, ISBN, or genre.
- Search matching for FR-008 is a case-insensitive substring on title, author, and genre. The plan says search those fields and does not define matching. Substring is the rule I am using so the criteria are testable.
- Blank search returns every book (FR-008-AC3). The plan does not say what an empty query does.
- FR-006 does not require an error code for the empty shelf. The empty list is the success result. The screen copy for that state is in [ui.md](ui.md).
