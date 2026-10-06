---
name: book-exchange-domain
description: "Domain rules for Easy Exchange book trading: categories, condition and jacket grades, trade lifecycle, ownership, reservations, and error codes. Use whenever writing or changing models, API routes, server actions, tests, or UI that touch books or trades."
---
# Book exchange domain
## Instructions
- Categories (only these): ARCHITECTURE_MONOGRAPH, ARCHITECTURAL_THEORY, ART_HISTORY, EXHIBITION_CATALOGUE, PHOTOGRAPHY, DESIGN, ARTIST_BOOK_ZINE.
- Book condition (only these): NEW, LIKE_NEW, GOOD, FAIR, POOR.
- Jacket condition (only these): NONE (no jacket), POOR, FAIR, GOOD, FINE.
- Category, condition, jacket condition, and trade status are database enums, not free text.
- A book has exactly one owner. Only the owner can edit or delete it.
- A trade is one of the requester's books for one of the recipient's books. A user can't trade with themselves.
- States: PENDING → ACCEPTED → COMPLETED, or PENDING → DECLINED / CANCELLED. Any other transition is rejected with 409.
- Only the recipient can accept or decline. Only the requester can cancel, and only while PENDING. Either party can mark an ACCEPTED trade COMPLETED.
- A book in a PENDING or ACCEPTED trade is reserved: it can't be offered or requested in another trade, edited, or deleted (409).
- Check the reservation and create the trade in one database transaction.
- On COMPLETED, the two books swap owners: the offered book goes to the recipient, the requested book to the requester.

## Error codes
| Status | When |
| --- | --- |
| 400 | Bad or missing input: blank required field, value outside an enum, year out of range, same book on both sides. |
| 403 | Wrong person: not the book's owner, not the party allowed to take that trade action. |
| 404 | The book, trade, or user doesn't exist. |
| 409 | Conflicts with current state: reserved book, self-trade, transition the status doesn't allow. |

Check order: propose is 400, 404, 403, 409. Trade actions are 404, 409, 403. Book edit and delete are 404, 403, 409, then 400.
