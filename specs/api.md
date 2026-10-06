# API

Server actions for the MVP. Shapes of User, Book, and Trade are in [data-model.md](data-model.md). Acceptance criteria are in [requirements.md](requirements.md).

Results look like this:

- Success: `{ ok: true, ... }`
- Failure: `{ ok: false, status: 400 | 403 | 404 | 409, message: string }`

The active user comes from the cookie described in [architecture.md](architecture.md). Actions that take an actor use that user. Tests call the `lib/` functions with an actor id directly.

## Session

### listUsers

- **Milestone:** M1. FR-002.
- **Input:** none.
- **Output:** `{ ok: true, users: { id, name }[] }` in seed order: Maya Chen, Jordan Hale, Sam Rivera.
- **Errors:** none. An empty database returns an empty array.

### setActiveUser

- **Milestone:** M1. FR-002.
- **Input:** `userId` string.
- **Output:** `{ ok: true, userId }`. Sets cookie `easy_exchange_user`.
- **Errors:**
  - 400 when `userId` is empty.
  - 404 when no user has that id. The cookie is left as it was.

### getActiveUser

- **Milestone:** M1. FR-002.
- **Input:** cookie value, or absent.
- **Output:** `{ ok: true, user }` for a known cookie. If the cookie is absent, the user is Maya Chen (`user_maya`) once seed has run.
- **Errors:** 404 when the cookie is absent or unknown and `user_maya` is not in the database. A cookie that names a missing user falls back to Maya Chen when she exists. That fallback is not the 404 from `setActiveUser`.

## Books

Validation for create and update:

- `title`, `author`, `isbn`, and `genre` are trimmed. Empty is 400.
- `condition` must be NEW, LIKE_NEW, GOOD, FAIR, or POOR. Anything else, including USED, is 400.
- `ownerId` in the input is ignored (NFR-005).

### createBook

- **Milestone:** M2. FR-003.
- **Input:** `title`, `author`, `isbn`, `condition`, `genre`. Actor is the active user.
- **Output:** `{ ok: true, book }` with `ownerId` set to the actor.
- **Errors:** 400 on a blank field or a bad condition. No book is written.

### updateBook

- **Milestone:** M2. FR-004.
- **Input:** `bookId`, `title`, `author`, `isbn`, `condition`, `genre`.
- **Output:** `{ ok: true, book }`. `ownerId` is the same as before.
- **Errors:**
  - 400 on a blank field or a bad condition. Stored values stay as they were.
  - 403 when the actor is not the owner.
  - 404 when `bookId` is not a book.
- **Trades:** this action does not read Trade. See Open Questions in [requirements.md](requirements.md).

### deleteBook

- **Milestone:** M2. FR-005.
- **Input:** `bookId`.
- **Output:** `{ ok: true }`.
- **Errors:**
  - 403 when the actor is not the owner. The book stays.
  - 404 when `bookId` is not a book.
- **Trades:** this action does not read Trade. See Open Questions in [requirements.md](requirements.md).

### listMyBooks

- **Milestone:** M2. FR-006.
- **Input:** actor id.
- **Output:** `{ ok: true, books }` containing only books whose `ownerId` is the actor, in seed id order, then by id for books added later.
- **Errors:** none. No books is an empty array, not an error.

### listAllBooks

- **Milestone:** M2. FR-007.
- **Input:** none. No search string and no condition.
- **Output:** `{ ok: true, books }` for every book, in id order. `ownerName` is the related user's name, joined at read time. It is not a column on Book.
- **Errors:** none. No books is an empty array.

### getBook

- **Milestone:** M3. FR-010. Not built in M1 or M2.
- **Input:** `bookId`.
- **Output:** `{ ok: true, book }` with title, author, isbn, condition, genre, and `ownerName`. `ownerName` is joined from User and is not a Book column.
- **Errors:** 404 when the id is not a book.

### searchBooks

- **Milestone:** M3. FR-008 and FR-009. Not built in M1 or M2.
- **Input:** `query` string, optional `condition`.
- **Output:** `{ ok: true, books }` whose title, author, or genre contains `query` (case-insensitive). A query that is empty or only spaces does not narrow the list. When `condition` is present, the book must also have that condition.
- **Errors:** 400 when `condition` is present and not one of the five grades.

## Trades

Not built in M1 or M2. The Trade model is still created in M1.

A book is reserved when any trade with status PENDING or ACCEPTED references it as offered or requested.

### proposeTrade

- **Milestone:** M4. FR-011.
- **Input:** `offeredBookId`, `requestedBookId`. Actor is the requester.
- **Output:** `{ ok: true, trade }` with status PENDING. `recipientId` is the owner of the requested book.
- **Errors:** checks run in this order, and the first failure is the one returned.
  1. 400 when either id is missing or both ids are the same.
  2. 404 when either book does not exist.
  3. 403 when the actor does not own the offered book.
  4. 409 when the actor also owns the requested book.
  5. 409 when either book is reserved.

### acceptTrade

- **Milestone:** M4. FR-012 and FR-016.
- **Input:** `tradeId`.
- **Output:** `{ ok: true, trade }` with status ACCEPTED. Both books stay reserved.
- **Errors:** in order: 404 if the trade does not exist; 409 if the status is not PENDING; 403 if the actor is not the recipient. Status does not change on 403 or 409.

### declineTrade

- **Milestone:** M4. FR-013 and FR-016.
- **Input:** `tradeId`.
- **Output:** `{ ok: true, trade }` with status DECLINED. Both books are no longer reserved. Owners do not change.
- **Errors:** in order: 404 if the trade does not exist; 409 if the status is not PENDING; 403 if the actor is not the recipient. Status and owners do not change on 403 or 409.

### cancelTrade

- **Milestone:** M4. FR-014 and FR-016.
- **Input:** `tradeId`.
- **Output:** `{ ok: true, trade }` with status CANCELLED. Both books are no longer reserved. Owners do not change.
- **Errors:** in order: 404 if the trade does not exist; 409 if the status is not PENDING; 403 if the actor is not the requester. Status and owners do not change on 403 or 409.

### completeTrade

- **Milestone:** M4. FR-015 and FR-016.
- **Input:** `tradeId`.
- **Output:** `{ ok: true, trade }` with status COMPLETED. The offered book's `ownerId` becomes `recipientId`. The requested book's `ownerId` becomes `requesterId`. Neither book stays reserved.
- **Errors:** in order: 404 if the trade does not exist; 409 if the status is not ACCEPTED; 403 if the actor is neither the requester nor the recipient. Status and owners do not change on 403 or 409.
