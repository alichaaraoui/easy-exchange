# Product

## Vision

Easy Exchange is how I swap a book I own for a book another student owns. One book for one book. No payment and no shipping.

## Personas

**Student with books to trade.** I am a university student. I own books I am finished with, and I want books other students already have. I list mine, look through theirs, and propose a swap. I use a demo-user switcher in this version because real login is later.

**The other student.** Same person, other side of the trade. They receive my proposal, accept or decline it, and can mark an accepted trade completed. I do not have a separate admin, seller, or courier.

## MVP scope

- Seeded demo users and a switcher.
- Add, edit, delete, and view books I own. One owner per book. Only the owner edits or deletes.
- A plain list of every book, then search by title, author, and genre, and a condition filter.
- Book detail: title, author, ISBN, condition, genre, owner.
- Propose one of my books for one of theirs.
- Recipient accepts or declines. Requester cancels only while pending. Either party marks an accepted trade completed, and the books swap owners.
- Condition grades: NEW, LIKE_NEW, GOOD, FAIR, POOR.
- Trade states: PENDING, ACCEPTED, DECLINED, CANCELLED, COMPLETED, with only the transitions in [architecture.md](architecture.md).

## Non-goals

Not in this version:

- Payments
- Shipping
- Chat
- Ratings
- Book photos
- Real login
- Campus meetups

Chat, ratings, book photos, real login, and campus meetups are later ideas. They are not MVP features. See [requirements.md](requirements.md).

## Assumptions

- Three named demo users and twelve books are enough to try both sides of a trade.
- The student using the switcher is the actor for every edit, delete, and trade action.
- Completing a trade only changes owners in the app. Meeting in person is a later feature.
