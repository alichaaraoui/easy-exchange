# API

Server actions and the `lib/` functions behind them (decision D3: no REST API). Shapes are in [data-model.md](data-model.md). Acceptance criteria are in [requirements.md](requirements.md).

Every `lib/` function returns:

- Success: `{ ok: true, ... }`
- Failure: `{ ok: false, status: 400 | 403 | 404 | 409, message: string }`

Server actions read the actor from the cookie ([architecture.md](architecture.md#active-user)) and pass it as `actorId`. Tests call the `lib/` functions with an actor id directly.

## Error codes

| Status | Meaning |
| --- | --- |
| 400 | Bad or missing input: blank required field, value outside an enum, year out of range, same book on both sides of a trade. |
| 403 | The actor isn't allowed: not the owner of the book, not the right party for that trade action. |
| 404 | The book, trade, or user doesn't exist. |
| 409 | The request conflicts with current state: reserved book, self-trade, transition the status doesn't allow, lost a race for the same book. |

## Session

### listUsers

- FR-002. Input: none. Output: `{ id, name }[]` in seed order Maya Chen, Jordan Hale, Sam Rivera.

### setActiveUser

- FR-002. Input: `userId`. Output: `{ ok: true, userId }`; sets the cookie.
- 400 when `userId` is blank. 404 when no user has that id; the cookie is unchanged.

### getActiveUser

- FR-002. Input: cookie value or none. Output: the user, falling back to Maya Chen. 404 when neither exists.

## Books

### Book input and validation

Fields: `title`, `author`, `isbn`, `category`, `publisher`, `year`, `edition`, `outOfPrint`, `condition`, `jacketCondition`.

- `title`, `author`, `isbn`, `publisher`: trimmed; blank is 400.
- `category`: one of the 7 Category values, else 400 (FR-017).
- `year`: a whole number from 1450 to the current year, else 400 (FR-018).
- `edition`: trimmed; blank is allowed and stored as "" (FR-018).
- `outOfPrint`: checkbox; present means true, absent means false.
- `condition`: one of NEW, LIKE_NEW, GOOD, FAIR, POOR, else 400.
- `jacketCondition`: one of NONE, POOR, FAIR, GOOD, FINE, else 400 (FR-019).
- `ownerId` and `coverUrl` in the input are ignored (NFR-005).

The first failing field is the one reported, in the order above. The message names the field.

### createBook

- FR-003, FR-017–FR-019, FR-021. Input: book input. Actor is the owner.
- Validates, looks up the cover (`lookupCover(isbn)`), then writes. Output `{ ok: true, book }`.
- 400 on any validation failure; nothing is written. A failed cover lookup is not an error (FR-021-AC3).

### updateBook

- FR-004, FR-017–FR-019, FR-021, FR-032. Input: `bookId` and book input.
- Checks in order: 404 not a book; 403 actor isn't the owner; 409 book is reserved; 400 validation.
- Looks up the cover again only when the trimmed ISBN differs from the stored one. Owner is unchanged.

### deleteBook

- FR-005, FR-032. Input: `bookId`.
- Checks in order: 404, 403, 409 reserved. On success the book and its closed trades are deleted in one transaction.

### listMyBooks

- FR-006. Input: actor id. Output: books the actor owns, seed ids first in id order, then later books by id.

### searchBooks

- FR-007, FR-023, FR-024. Input: `{ q?, category?, condition?, outOfPrint? }`, all optional.
- `q` is trimmed. Blank doesn't narrow. Otherwise title or author must contain it, case-insensitive.
- `category` and `condition`: blank doesn't narrow; otherwise must be an enum value (400 if not) and must match.
- `outOfPrint: true` keeps only out-of-print books; false or absent doesn't narrow.
- Output `{ ok: true, books }` in id order, each with `ownerName` joined from User. With no input this is the FR-007 list (`listAllBooks`).

### parseBrowseParams

- FR-024-AC7. Input: URL search params `q`, `category`, `condition`, `oop`. Output: the `searchBooks` input. `oop=1` means out of print only.

### getBook

- FR-025. Input: `bookId`. Output `{ ok: true, book }` with every field and `ownerName`. 404 when not a book.

### isReserved / listOfferableBooks

- FR-032, FR-034. `isReserved(bookId)` is true when a PENDING or ACCEPTED trade references the book. `listOfferableBooks(actorId)` returns the actor's books that aren't reserved.

## Covers

### lookupCover

- FR-021. Input: ISBN. Removes spaces and hyphens, requests `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg?default=false` with a 3-second timeout.
- 200 returns `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`. Anything else (404, other status, network error, timeout) returns null. Never throws.

## Trades

A book is reserved when a PENDING or ACCEPTED trade references it as offered or requested.

### proposeTrade

- FR-026. Input: `offeredBookId`, `requestedBookId`. Actor is the requester.
- Output `{ ok: true, trade }`, status PENDING, `recipientId` = owner of the requested book.
- Checks in order, first failure returned:
  1. 400 either id missing, or both ids the same.
  2. 404 either book doesn't exist.
  3. 403 actor doesn't own the offered book.
  4. 409 actor also owns the requested book.
  5. 409 either book is reserved.
- Steps 2–5 and the insert run in one Serializable transaction. A serialization failure returns 409 "One of these books was just reserved in another trade."

### acceptTrade / declineTrade / cancelTrade / completeTrade

- FR-027–FR-031. Input: `tradeId`. Checks in order: 404 no such trade; 409 the status doesn't allow this action; 403 wrong person.

| Action | Allowed from | Who | New status | Effect |
| --- | --- | --- | --- | --- |
| acceptTrade | PENDING | recipient | ACCEPTED | Books stay reserved. |
| declineTrade | PENDING | recipient | DECLINED | Books released. |
| cancelTrade | PENDING | requester | CANCELLED | Books released. |
| completeTrade | ACCEPTED | requester or recipient | COMPLETED | Offered book → recipient, requested book → requester, in one transaction. Books released. |

- On 403 or 409, status and owners don't change.

### listTrades

- FR-033. Input: actor id. Output `{ received, sent }`: trades where the actor is recipient or requester, newest first, each with both book titles, both user names, status, and `actions`: the subset of `accept`, `decline`, `cancel`, `complete` the actor may take now.

## Server actions

| Action | Calls | On success | On failure |
| --- | --- | --- | --- |
| `setActiveUserAction` | setActiveUser | redirect to the same page | stays |
| `createBookAction` | createBook | redirect `/shelf` | form shows message |
| `updateBookAction` | updateBook | redirect `/shelf` | form shows message |
| `deleteBookAction` | deleteBook | redirect `/shelf` | edit page shows message |
| `proposeTradeAction` | proposeTrade | redirect `/trades?proposed={tradeId}` | detail page shows message |
| `tradeAction` (accept/decline/cancel/complete) | the matching function | redirect `/trades` | `/trades` shows message |
