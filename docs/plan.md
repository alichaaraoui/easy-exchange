# Easy Exchange — plan

Book-exchange platform for university students. No code in this document. Scope below is only what the playbook states.

## 1. Problem & target user

University students own books they are done with and need books other students already own. Easy Exchange lets them list those books and trade them one-for-one. No money changes hands. The target user is a student who lists books they own and wants to swap, not buy or sell.

## 2. MVP feature list (must-have) vs. later (nice-to-have)

**Must-have**

- List a book (add, edit, and delete only books you own; a book has one owner).
- Browse and search by title, author, and genre, and filter by condition.
- Propose a trade: the requester offers one of their books for one of the recipient's books.
- Accept or decline a proposal.
- Cancel a pending trade, and mark an accepted trade completed. On completion, ownership of the two books swaps.

**Condition grades (only these):** NEW, LIKE_NEW, GOOD, FAIR, POOR.

**Trade states:** PENDING → ACCEPTED → COMPLETED, or PENDING → DECLINED / CANCELLED. No other transitions. A book in a PENDING or ACCEPTED trade is reserved and cannot be offered in a new trade. You cannot trade with yourself.

**Later (nice-to-have)**

The playbook does not name a nice-to-have list.

**Out of scope**

- Payments
- Shipping
- Real authentication (use seeded demo users and a user switcher)

## 3. Key user flows

### List a book

1. Use the user switcher to act as a seeded demo user.
2. Add a book you own: title, author, ISBN, condition, genre.
3. Edit or delete that book later. Only the owner can edit or delete it.
4. The book shows on your shelf.

### Propose a trade

1. Browse or search other students' books by title, author, genre, and condition.
2. Choose one book you want and one of your own books to offer.
3. Submit the proposal. The trade is PENDING. Both books are reserved and cannot be offered in another trade.
4. The proposal is rejected if you would be trading with yourself, if either book is already reserved, or if the offer is not one book for one book.

### Respond to a trade

1. Open the pending proposal.
2. Accept it (PENDING → ACCEPTED) or decline it (PENDING → DECLINED).
3. Cancel is only from PENDING (PENDING → CANCELLED).
4. Mark an ACCEPTED trade completed (ACCEPTED → COMPLETED). Ownership of the two books swaps.
5. Any other transition is rejected.

## 4. Proposed tech stack

- **Next.js (App Router):** the web app the playbook specifies.
- **TypeScript:** the language the playbook specifies for the app.
- **Prisma:** access to User, Book, and Trade data.
- **SQLite:** the local database the playbook specifies, with no separate database service.
- **Tailwind:** styling for the pages.
- **Vitest:** tests for features as each milestone lands.
- **Playwright:** end-to-end test of the full trade flow in M5.

## 5. Risks & open questions

- Demo users and a switcher stand in for authentication. Ownership checks still have to use the active demo user.
- A reserved book (PENDING or ACCEPTED) must not be offered again. Missing that check breaks the trade rules.
- Illegal trade transitions must be rejected. The playbook allows only the transitions in section 2.
- The playbook does not say who may cancel a PENDING trade, or who marks an ACCEPTED trade COMPLETED.
- The playbook does not list nice-to-have features. Do not add any until they are written into this plan.
- Pages named for the UI spec, not built in this phase: Browse, Book detail, My Shelf, Add Book, Trades inbox.

## 6. Milestones

Each milestone is one implementation session. Specs come before M1. No features before the scaffold.

- **M1 Scaffold.** Project layout, Prisma schema, and seed data: 3 demo users and 12 books. No features yet.
- **M2 Books.** List, add, edit, and delete my books.
- **M3 Browse.** Browse and search by title, author, and genre, plus a condition filter.
- **M4 Trades.** Propose a trade, accept, decline, cancel, complete, and swap ownership.
- **M5 Polish.** Apply the UI spec to Browse, Book detail, My Shelf, Add Book, and Trades inbox. Add a Playwright test for the full trade flow.
