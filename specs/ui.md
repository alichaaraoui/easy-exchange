# UI

Screens for the MVP. What each control does is in [api.md](api.md). Copy below is the text on the page, not placeholder text.

The header is on every page.

## Header

- Wordmark: Easy Exchange.
- M1 links: none. The header is the wordmark and the switcher.
- M2 links: All books, My shelf, Add a book.
- Trades is added in M4, when that page exists. It is not in the M1 or M2 header.
- Switcher label: "Acting as". The control is a `<select>` of the seeded names plus a button, "Switch".
- No password field and no sign-up link (NFR-003).
- Every control has a visible label (NFR-004).

## All books (`/`)

**M2, FR-007.** Built as a list, not a search page.

- Heading: All books.
- One line under it: "Every book a student has listed. Search comes later."
- Each book shows title, author, condition, genre, and owner name.
- No search box. No condition filter. Those are M3, on this same page, for FR-008 and FR-009.
- Empty state: "No books are listed yet."

## My shelf (`/shelf`)

**M2, FR-006.**

- Heading: My shelf.
- Line: "Books you own. Only you can change them."
- Each of my books shows title, author, condition, genre, and ISBN, with links "Edit" and "Delete".
- Delete asks for a confirm in the form button label "Delete {title}" so the action is explicit. No extra page.
- Empty state: "You have no books listed yet."
- I do not see edit or delete on books I do not own, because those books are not on this page.

## Add a book (`/books/new`)

**M2, FR-003.**

- Heading: Add a book.
- Fields, each with a visible label: Title, Author, ISBN, Condition, Genre.
- Condition is a `<select>` of NEW, LIKE_NEW, GOOD, FAIR, POOR. The labels a person sees are New, Like new, Good, Fair, and Poor. The stored values stay the five grades.
- Button: "Add book".
- On 400, the form stays and the message says which field failed. The message is text, not color alone.
- On success, go to My shelf.

## Edit a book (`/books/[id]/edit`)

**M2, FR-004 and FR-005.**

- Heading: Edit book.
- Same fields as add, filled with the current book.
- Buttons: "Save" and "Delete {title}".
- If I am not the owner, I do not get the form. The page says "You can only edit a book you own." That is the 403.
- If the id is not a book, the page says "That book is not listed." That is the 404.
- On success after save or delete, go to My shelf.

## Book detail (`/books/[id]`)

**M3, FR-010.** Not built in M1 or M2.

- Shows title, author, ISBN, condition, genre, and owner name.
- No photo, rating, or chat.
- Unknown id uses the same not-listed message as edit.
- A "Propose a trade" control waits for M4. It is not on the M2 pages.

## Trades inbox (`/trades`)

**M4, FR-011 through FR-016.** Not built in M1 or M2.

- Heading: Trades.
- Lists trades where I am the requester or the recipient, with status and the two book titles.
- Accept and Decline show only for the recipient on a PENDING trade.
- Cancel shows only for the requester on a PENDING trade.
- Mark completed shows for either party on an ACCEPTED trade.
- No other actions.

## Later, not on these screens

Chat, ratings, book photos, real login, and campus meetups do not get buttons or fields in this UI.
