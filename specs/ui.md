# UI

Screens and copy. What each control calls is in [api.md](api.md). Copy below is the real text on the page.

## Layout and visual rules

- Works from 375 px wide upward with no horizontal scrolling (NFR-006). Book grids are 2 columns on phones, 3 on tablets, 4 on desktop.
- Covers are shown at a 2:3 ratio. The image keeps its proportions inside that box.
- Placeholder (FR-022): same 2:3 box, a flat muted background, the title and author as text. No `<img>`, so it can't break.
- Every image has alt "Cover of {title} by {author}" (NFR-009).
- Errors are shown as text near the control, not by color alone.
- The design pass in M6 applies an imported design skill to every page within these rules.

## Header

- Wordmark: Easy Exchange.
- Links: Browse, My shelf, Add a book, Trades.
- Switcher: label "Acting as", a `<select>` of the seeded names, and a "Switch" button.
- No password field and no sign-up link (NFR-003). Every control has a visible label (NFR-004).

## Browse (`/`)

FR-007, FR-023, FR-024.

- Heading: Browse.
- Line: "Architecture and art books, one for one. No money changes hands."
- Filter form (GET, so values stay in the URL):
  - "Search title or author" text box, name `q`.
  - "Category" select, first option "Any category", then the 7 labels.
  - "Condition" select, first option "Any condition", then the 5 labels.
  - "Out of print only" checkbox, name `oop`.
  - Buttons "Search" and a "Clear" link to `/`.
- Result line: "{n} books" ("1 book" when one).
- Grid of book cards.
- Empty states: no books at all: "No books are listed yet." Books exist but none match: "No books match these filters." with the "Clear" link.
- Bad filter value in the URL (400): "That filter isn't valid." and the full list is not shown.

## Book card

FR-022.

- Cover or placeholder, title, author, category label, condition label, owner name. "Out of print" badge when true.
- The whole card links to `/books/{id}`.

## My shelf (`/shelf`)

FR-006.

- Heading: My shelf.
- Line: "Books you own. Only you can change them."
- Each book: cover or placeholder, title, author, category, condition, ISBN, links "Edit" and a "Delete {title}" button.
- A reserved book shows "In an open trade" instead of Edit and Delete (FR-032).
- Empty state: "You have no books listed yet." with a link "Add a book".

## Add a book (`/books/new`)

FR-003, FR-017–FR-019, FR-021.

- Heading: Add a book.
- Fields, each with a visible label, in this order: Title, Author, ISBN, Category (select), Publisher, Year (number), Edition (optional), Out of print (checkbox), Condition (select), Jacket condition (select).
- Edition's label reads "Edition (optional)".
- Selects show labels from [data-model.md](data-model.md#enums) and submit enum values.
- Line under ISBN: "We look up the cover on Open Library by ISBN."
- Button: "Add book". On 400 the form keeps the entered values and shows the message. On success go to My shelf.

## Edit a book (`/books/[id]/edit`)

FR-004, FR-005, FR-032.

- Heading: Edit book. Same fields as add, filled in. Buttons "Save" and "Delete {title}".
- Not the owner (403): "You can only edit a book you own." No form.
- Not a book (404): "That book is not listed."
- Reserved (409): "This book is in an open trade, so it can't be edited or deleted until the trade closes." No form.
- On success go to My shelf.

## Book detail (`/books/[id]`)

FR-025, FR-026, FR-034.

- Cover or placeholder, large. Title as heading, author under it.
- A definition list: ISBN, Category, Publisher, Year, Edition ("—" when blank), Out of print (Yes / No), Condition, Jacket condition, Owner.
- Propose section, heading "Propose a trade":
  - My own book: "This is your book." and an "Edit" link. No form.
  - Book is reserved: "This book is in an open trade and can't be requested right now." No form.
  - I have unreserved books: label "Offer one of your books", a select of my unreserved books (title — condition), button "Propose a trade".
  - I have none (FR-034): the button is disabled and the page says "You have no books free to offer. Add a book or wait for one of your trades to close."
  - On failure the message shows above the form.
- Unknown id: 404 page "That book is not listed." with a link "Back to Browse".

## Trades (`/trades`)

FR-027–FR-031, FR-033.

- Heading: Trades.
- After a proposal: "Trade proposed. Both books are reserved until {recipient name} responds."
- Two sections: "Received" and "Sent".
- Each trade: "{requester} offers {offered title} for {requested title}", the status label, and the date.
- Buttons, only these:
  - Received + PENDING: "Accept", "Decline".
  - Sent + PENDING: "Cancel".
  - ACCEPTED, either side: "Mark completed".
  - DECLINED, CANCELLED, COMPLETED: none.
- Empty: "No trades received yet." / "No trades sent yet."
- An action failure shows its message at the top of the page.

## Not on these screens

Photo uploads, multi-book offers, chat, ratings, real login, and campus meetups get no buttons or fields.
