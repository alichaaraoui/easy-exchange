# Easy Exchange — plan

I am building Easy Exchange for university students who already own books and want different ones. I list a book I own, someone else lists a book they own, and we swap one for one. Nobody pays.

## 1. Problem & target user

I keep textbooks and other books I am done with, and so do the students around me. Buying another copy, or selling mine, is the wrong trade. I want a place where a student lists books they own and swaps one of theirs for one of mine. The person I am building this for is that student: they own books, they want books, and they do not want money in the middle.

## 2. MVP feature list (must-have) vs. later (nice-to-have)

**Must-have**

- I can add a book I own, then edit it or delete it. A book has one owner. Only I can edit or delete a book I own.
- I can browse books and search by title, author, and genre, and I can filter by condition.
- I can propose a trade: one book of mine for one book of theirs.
- The recipient can accept or decline. I cannot accept my own proposal.
- I can cancel a trade only while it is still pending, and only if I am the requester. Either of us can mark an accepted trade completed. When it completes, the two books swap owners.

**Condition grades, and only these:** NEW, LIKE_NEW, GOOD, FAIR, POOR.

**Trade states:** PENDING → ACCEPTED → COMPLETED, or PENDING → DECLINED, or PENDING → CANCELLED. I will reject every other transition. A book in a PENDING or ACCEPTED trade is reserved and cannot be offered in a second trade. I cannot trade with myself.

**Later**

- Chat
- Ratings
- Book photos
- Real login
- Campus meetups

**Out of scope**

- Payments
- Shipping

For this version I use seeded demo users and a user switcher. Real login is one of the later items, not part of the MVP.

## 3. Key user flows

### List a book

1. I use the switcher to act as one of the seeded demo users.
2. I add a book I own: title, author, ISBN, condition, and genre.
3. I edit or delete that book later. If it is not mine, the edit or delete is rejected.
4. The book shows on my shelf.

### Propose a trade

1. I browse or search other students' books by title, author, genre, and condition.
2. I pick one book I want and one of my own books to offer.
3. I submit the proposal. The trade is PENDING. Both books are reserved.
4. The proposal is rejected if I would be trading with myself, if either book is reserved, or if I am not offering exactly one of my books for exactly one of theirs.

### Respond to a trade

1. The recipient opens the pending proposal.
2. Only the recipient can accept it (PENDING → ACCEPTED) or decline it (PENDING → DECLINED).
3. Only the requester can cancel, and only from PENDING (PENDING → CANCELLED).
4. Either the requester or the recipient can mark an ACCEPTED trade completed (ACCEPTED → COMPLETED). Ownership of the two books swaps.
5. Any other transition is rejected.

## 4. Proposed tech stack

- **Next.js (App Router):** I want the pages and the server actions in one project. The App Router lets me load the shelf and the trade on the server, next to the page that shows them.
- **TypeScript:** The trade rules are strict. I want a bad status or a missing owner to fail at compile time, not after someone has already swapped the wrong book.
- **Tailwind:** I can style the shelf, the forms, and the header in the components. I do not want a separate CSS project for a handful of pages.
- **Prisma:** User, Book, and Trade stay in one schema, and the queries that enforce an owner or a trade state stay typed.
- **SQLite:** This is a local demo. One database file means I can clone the repo and run it without standing up Postgres.
- **Vitest:** Each acceptance criterion gets a fast test as I finish the milestone. I do not need a browser for those checks.
- **Playwright:** In the last milestone I want one end-to-end run of the full trade: list, propose, accept, complete, and see the owners swap.

## 5. Risks & open questions

- The switcher is not real login. I still have to treat the active demo user as the only person who can edit, delete, or act on a trade.
- If I forget the reserved-book check, someone can offer the same book in two trades.
- If I forget the state check, a declined trade could still be completed. Illegal transitions stay rejected.
- I have not decided whether I can edit or delete a book that is already reserved.
- I have not decided an ISBN format. I will store what I type.
- Genre is free text. I am not picking a fixed list.
- Chat, ratings, photos, real login, and campus meetups stay out until I add them here on purpose.

## 6. Milestones

Specs come before I write features. Each milestone is one session.

- **M1 Scaffold.** App layout, Prisma schema, and seed data: 3 demo users and 12 books. Header with the demo-user switcher. No book or trade features yet. The Trade model exists in the schema so later milestones do not reshape the database.
- **M2 Books.** List, add, edit, and delete my books. Also show a plain list of every book, with no search and no filters yet.
- **M3 Browse.** Search by title, author, and genre, plus a condition filter, and open a book.
- **M4 Trades.** Propose, accept, decline, cancel, complete, and swap ownership.
- **M5 Polish.** Apply the UI spec to Browse, Book detail, My Shelf, Add Book, and Trades inbox. Add a Playwright test for the full trade flow.
