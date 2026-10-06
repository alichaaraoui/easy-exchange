---
name: book-exchange-domain
description: "Domain rules for Easy Exchange book trading: condition grades, trade lifecycle, ownership and permissions. Use whenever writing or changing models, API routes, server actions, tests, or UI that touch books or trades."
---
# Book exchange domain
## Instructions
- Condition grades (only these): NEW, LIKE_NEW, GOOD, FAIR, POOR.
- A book has exactly one owner. Only the owner can edit or delete it.
- A trade is one of the requester's books for one of the recipient's books.
- States: PENDING → ACCEPTED → COMPLETED, or PENDING → DECLINED / CANCELLED. Any other transition is rejected with 409.
- Only the recipient can accept or decline. Only the requester can cancel a PENDING trade. Either party can mark an ACCEPTED trade COMPLETED.
- A book in a PENDING or ACCEPTED trade is reserved and can't be in another trade.
- On COMPLETED, the two books swap owners.
- A user can't trade with themselves.
