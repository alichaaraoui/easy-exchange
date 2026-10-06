# Process log

Running log for Easy Exchange. One entry per prompt.

Columns: date | phase | prompt | skill used | outcome | what I fixed.

Entry template:

```md
### 2026-10-07 · Planning · Prompt #3
**Prompt:** (paste)
**Mode / Skill:** Plan mode, /book-exchange-domain
**Result:** what the agent produced
**My judgment:** what I kept, rejected, or rewrote, and why
```

The "My judgment" line is the part that matters: what was kept, rejected, or rewritten, and why.

---

### 2026-10-06 · Setup · Phase 0

**Prompt:** Set up the repo from the playbook only. Rename `alichaaraoui/bookExchange` to `easy-exchange`, point `origin` at the new URL, and add `docs/process-log.md`, `docs/plan.md`, `specs/.gitkeep`, and `.cursor/skills/.gitkeep`. No application code. Do not invent product scope.

**Mode / Skill:** Agent. No project skill yet (`.cursor/skills/` is empty on purpose; custom skills are Phase 2).

**Result:** Repository renamed. `origin` is `https://github.com/alichaaraoui/easy-exchange.git`. Added this log, `docs/plan.md` (Phase 1 sections, content taken from the playbook), and empty `specs/` and `.cursor/skills/` placeholders.

**My judgment:** Kept the playbook's users, MVP, out-of-scope list, stack, domain rules, and M1–M5. Did not add features the playbook does not name. Left `specs/` and `.cursor/skills/` empty for Phase 3 and Phase 2.

---

### 2026-10-06 · Setup · Skills

**Prompt:** Add `.gitignore` (`node_modules`, `.DS_Store`, `.env`, `*.db`, `.next`) and commit the four skills in `.cursor/skills/` as `feat: add project skills`. Do not rewrite the skill files.

**Mode / Skill:** No skill invoked. The files are the skills I will use in the next steps.

**Result:** Copied `requirements-engineering`, `spec-writer`, `book-exchange-domain`, and `implement-from-spec` as they were written. Added `.gitignore`. Left `.cursor/skills/.gitkeep`.

**My judgment:** I did not edit the skill text. I ignored `.DS_Store` instead of committing it.

---

### 2026-10-06 · Planning · Plan rewrite

**Prompt:** Rewrite `docs/plan.md` in the first person. Remove every mention of "the playbook". Give a real reason for Next.js App Router, TypeScript, Tailwind, Prisma, SQLite, and Vitest. List later features: chat, ratings, book photos, real login, campus meetups.

**Mode / Skill:** book-exchange-domain

**Result:** Rewrote the plan in my voice. Must-have stays list, browse/search, propose, accept/decline, cancel, complete, and the ownership swap. Later list is the five features above. Payments and shipping stay out. Trade actors match the domain skill: only the recipient accepts or declines, only the requester cancels a PENDING trade, either party completes an ACCEPTED trade.

**My judgment:** I kept Playwright because M5 still needs one end-to-end trade test, and I wrote a reason for it. I moved real login from "out of scope" to "later" because that is where I was told to put it. I did not add chat, ratings, photos, or meetups to the MVP. I left edit/delete of a reserved book, ISBN format, and genre vocabulary as open questions.
