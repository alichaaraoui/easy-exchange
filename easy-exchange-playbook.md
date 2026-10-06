# Easy Exchange (Book Exchange): Cursor Playbook

You run every step below yourself in Cursor. The prompts are starting points: edit them so they sound like you. Your grade depends on the **process**, so the most important habit is to **log every prompt, which Skill fired, and what you changed** in `docs/process-log.md`. That log becomes your presentation.

---

## Phase 0: Setup (≈15 min)

```bash
mkdir easy-exchange && cd easy-exchange && git init
```

```bash
gh repo create easy-exchange --public --source=. --remote=origin
```

Open the folder in Cursor (File → Open Folder). Create these empty files first:

```
docs/process-log.md      ← running log: date | phase | prompt | skill used | outcome | what I fixed
docs/plan.md             ← output of Phase 1
specs/                   ← output of Phase 3
.cursor/skills/          ← your custom skills (Phase 2)
```

Process-log entry template:

```md
### 2026-10-07 · Planning · Prompt #3
**Prompt:** (paste)
**Mode / Skill:** Plan mode, /book-exchange-domain
**Result:** what the agent produced
**My judgment:** what I kept, rejected, or rewrote, and why
```

The "My judgment" line is the part your professor cares about.

---

## Phase 1: Plan before any code

Use **Plan mode** (or Ask mode) so the agent can't write code yet. Prompt-engineering techniques to point out in class: role, context, constraints, explicit output format, and asking it to question you first.

**Prompt 1: Ask before planning**
```
You are a senior product engineer helping me plan a web app called Easy Exchange,
a book-exchange platform for university students. Do NOT write any code.

Before proposing anything, ask me up to 8 clarifying questions about users,
scope, trust/safety, and tech constraints. Number them. Wait for my answers.
```

Answer the questions in your own words. Things to decide:
- Users: students who list books they own and want to trade (1-for-1 swaps; no money).
- MVP scope: list a book, browse/search, propose a trade, accept/decline, mark completed.
- Out of scope: payments, shipping, real auth (use seeded demo users + a user switcher).
- Stack: Next.js (App Router) + TypeScript + Prisma + SQLite + Tailwind, tests with Vitest + Playwright.

**Prompt 2: Write the plan**
```
Using my answers, write docs/plan.md with these sections, in this order:
1. Problem & target user (3–4 sentences)
2. MVP feature list (must-have) vs. later (nice-to-have)
3. Key user flows as numbered steps (list a book, propose trade, respond to trade)
4. Proposed tech stack with a one-line justification each
5. Risks & open questions
6. Milestones (M1..M5), each small enough for one implementation session
Keep it under 2 pages. No code.
```

**Prompt 3: Critique the plan**
```
Act as a skeptical reviewer. List the 5 weakest points in docs/plan.md
(scope creep, ambiguity, missing edge cases). Suggest a fix for each. Don't edit the file.
```
Apply the fixes you agree with yourself, and log which ones you rejected.

---

## Phase 2: Skills (native + imported)

Cursor finds skills in `.cursor/skills/<name>/SKILL.md` (it also reads `.agents/skills/` and `.claude/skills/`). Frontmatter needs `name` (must match the folder name) and `description`. The description decides when the agent auto-applies the skill. `disable-model-invocation: true` makes a skill run only when you call it with `/name`.

### 2a. Native skills: built-ins you should use and mention
| Built-in | When to use it |
|---|---|
| `/create-skill` | Generate your custom skills below (then edit them by hand) |
| `/create-rule` | Project coding conventions (TS strict, folder layout, naming) |
| `/review` | After every milestone, before you commit |
| `/review-security` | Once at the end (input validation, trade authorization) |
| `/split-to-prs` | Optional: split a big milestone into clean PRs |

### 2b. Custom project skills (write them with `/create-skill`, then refine)

**`.cursor/skills/book-exchange-domain/SKILL.md`**: the domain rules every prompt should follow
```md
---
name: book-exchange-domain
description: Domain rules for Easy Exchange book trading — book condition grades, trade lifecycle and states, ownership rules. Use whenever writing or changing models, API routes, or UI that touches books or trades.
---
# Book Exchange Domain Rules
- Condition grades (only these): NEW, LIKE_NEW, GOOD, FAIR, POOR.
- A Book has one owner. Only the owner can edit/delete it.
- Trade = requester offers ONE of their books for ONE of the recipient's books.
- Trade states: PENDING → ACCEPTED → COMPLETED, or PENDING → DECLINED / CANCELLED.
  No other transitions are allowed; reject anything else with a 409.
- A book in a PENDING or ACCEPTED trade is "reserved" and can't be offered in a new trade.
- On COMPLETED, ownership of the two books swaps.
- You can't trade with yourself.
```

**`.cursor/skills/spec-writer/SKILL.md`**: keeps your specs consistent
```md
---
name: spec-writer
description: Writes and updates specification files in specs/. Use when creating or editing requirements, architecture, data model, API, or acceptance-criteria documents.
---
# Spec Writer
- Every requirement gets a stable ID: FR-### (functional), NFR-### (non-functional).
- Acceptance criteria use Given / When / Then and reference the FR ID.
- Never invent features not in docs/plan.md. If something is unclear, add it to an "Open Questions" section.
- Keep each spec file focused on one concern; link between files instead of duplicating.
```

**`.cursor/skills/implement-from-spec/SKILL.md`**: manual-only, so you control when it runs
```md
---
name: implement-from-spec
description: Implements one requirement from specs/ end-to-end with tests.
disable-model-invocation: true
---
# Implement From Spec
1. Read the referenced FR IDs in specs/requirements.md and their acceptance criteria.
2. State a short plan (files to touch) before editing.
3. Implement the smallest change that satisfies the criteria.
4. Write tests that map 1:1 to each Given/When/Then.
5. Run tests; report pass/fail. Do not move on with failing tests.
6. List any spec gaps you hit; do not silently decide them.
```

### 2c. Imported skills
Pick one or both:
- **Copy from a public skills repo.** Anthropic's open `anthropics/skills` repo on GitHub has `frontend-design` and `webapp-testing`. Copy those folders into `.cursor/skills/` (Cursor reads the same SKILL.md format) and credit the source in your log.
- **Install a plugin.** In Cursor, go to **Customize → From GitHub Repository** and install a skills plugin. That route only works for repos packaged as Cursor plugins (`.cursor-plugin/marketplace.json`).

In class, explain why you imported each one and show a moment where it changed what the agent produced. For example, `frontend-design` stops the default generic-looking UI.

---

## Phase 3: Specs (`specs/`)

Invoke `/spec-writer` and generate the files one at a time, reviewing each before moving to the next:

| File | Contents |
|---|---|
| `specs/product.md` | Vision, personas, MVP scope, non-goals |
| `specs/requirements.md` | FR-001… and NFR-001… with acceptance criteria (Given/When/Then) |
| `specs/data-model.md` | User, Book (title, author, ISBN, condition, genre, ownerId), Trade (requesterId, recipientId, offeredBookId, requestedBookId, status, timestamps), plus an ER diagram (Mermaid) |
| `specs/architecture.md` | Folder structure, layers (UI → server actions/API → Prisma), state-machine diagram for Trade |
| `specs/api.md` | Every route/action: input, output, errors (400/403/404/409) |
| `specs/ui.md` | Page list (Browse, Book detail, My Shelf, Add Book, Trades inbox), what's on each |

**Example prompt**
```
/spec-writer Using docs/plan.md and the book-exchange-domain skill, write
specs/requirements.md. Cover only MVP features. Every FR needs at least two
acceptance criteria, including one failure case (e.g., trading a reserved book).
End with an Open Questions section.
```

Then run a consistency check:
```
Cross-check all files in specs/. List any contradictions, missing FR references,
or data-model fields used in api.md but not defined. Don't fix, just list.
```

Commit after this phase. A git history that shows plan → specs → code is good evidence for the presentation.

---

## Phase 4: Implementation, one milestone at a time

Start a **new chat for each milestone** so context stays clean, and explain this choice in class.

| Milestone | Prompt (with `/implement-from-spec`) |
|---|---|
| M1 Scaffold | `Scaffold the project per specs/architecture.md. Prisma schema from specs/data-model.md, seed 3 demo users + 12 books. No features yet.` |
| M2 Books | `/implement-from-spec FR-001..FR-00x (list, add, edit, delete my books)` |
| M3 Browse | `/implement-from-spec browse + search by title/author/genre + condition filter` |
| M4 Trades | `/implement-from-spec trade proposal, accept/decline/cancel, complete + ownership swap` |
| M5 Polish | `Apply the frontend-design skill to all pages per specs/ui.md. Then add Playwright tests for the full trade flow using webapp-testing.` |

After each milestone:
1. Run the tests yourself.
2. Run `/review` and fix or reject its findings, noting why in the log.
3. Commit with a message referencing FR IDs, e.g. `feat(trades): FR-010–FR-014 trade lifecycle`.

If the agent breaks a domain rule (e.g., lets a reserved book be traded), **log it**. Showing that your skill or spec caught an AI mistake is strong presentation material.

---

## Phase 5: Presentation outline (HOW > WHAT)

1. **Approach:** plan → specs → implement, and why you didn't just prompt "build me a book exchange"
2. **Prompt engineering:** show 2–3 prompts before and after you refined them (role, constraints, output format, ask-first)
3. **Skills:** native ones (`/create-skill`, `/review`) vs. custom ones (domain, spec-writer, implement-from-spec) vs. imported ones (where they came from and the effect)
4. **Specs as the contract:** FR IDs flow from spec → tests → commits
5. **Where the AI went wrong** and how the process caught it
6. **Short demo** (≤2 min): list a book, propose a trade, accept it, see the ownership swap
7. **Lessons:** what you'd do differently
