# Product

Source: [docs/plan.md](../docs/plan.md) (plan v2). Requirements are in [requirements.md](requirements.md).

## Vision

Easy Exchange is a one-for-one exchange for architecture and art books. Students and collectors swap books they own for books they want. No money changes hands.

Every listing shows the cover and the collector details that matter for these books: publisher, year, edition, whether it is out of print, and the condition of the book and its dust jacket.

## Personas

**Primary: Lena, architecture student (24).** In a graduate architecture program. Owns theory readers and a few monographs from past studios. Wants specific books for her thesis but can't spend $90 on a used catalogue. Cares about finding a specific title fast and knowing the condition before she offers anything. Lena is the reason search and categories exist.

**Secondary: Marcus, designer and collector (38).** Collects architecture monographs and exhibition catalogues. Has duplicates and books outside his focus. Cares about edition, out-of-print status, and jacket condition. Marcus is the reason the collector fields exist.

Both use the same features. Neither has an admin role.

## MVP scope (Must)

- Seeded demo users and an "Acting as" switcher.
- Add, edit, delete my books; My shelf; list of all books.
- Book fields: title, author, ISBN, category, publisher, year, edition, out of print, condition, jacket condition.
- Cover image from Open Library by ISBN, with a placeholder fallback.
- Search by title or author; filter by category, condition, and out of print.
- Book detail page.
- Propose a 1-for-1 trade; accept, decline, cancel; complete with ownership swap.
- Deployed on Vercel with Neon Postgres.

## Should

- A Trades inbox split into "Received" and "Sent".
- "Propose a trade" is disabled when I have no unreserved books to offer, with a message explaining why.

## Could (later, not built)

- Owner photo uploads of their actual copy.
- Multi-book offers.
- Chat between traders, ratings, real login, campus meetups.

## Won't

- Payments, shipping, selling.

## Success criteria

The measurable criteria are plan v2 section 3. Each maps to requirements in the traceability table in [requirements.md](requirements.md#traceability).

## Assumptions

- Three demo users and twelve real books are enough to try both sides of a trade.
- The user picked in the switcher is the actor for every add, edit, delete, and trade action.
- Completing a trade only changes owners in the app. Meeting up happens outside it.
- All data is fake. Anyone can act as anyone (decision D5).
