import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BookFields } from "@/components/book-fields";
import { Header } from "@/components/header";
import { EMPTY_BOOK_FORM, readBookForm, toBookInput } from "@/lib/book-form";
import { validateBookFields } from "@/lib/validation";

const filled = {
  bookId: "book_08",
  title: "Learning from Las Vegas",
  author: "Robert Venturi, Denise Scott Brown, Steven Izenour",
  isbn: "0262220156",
  category: "ARCHITECTURAL_THEORY",
  publisher: "MIT Press",
  year: "1972",
  edition: "1st ed.",
  outOfPrint: true,
  condition: "FAIR",
  jacketCondition: "POOR",
};

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

const submitted = {
  title: "The Architecture of the City",
  author: "Aldo Rossi",
  isbn: "0262680432",
  category: "ARCHITECTURAL_THEORY",
  publisher: "MIT Press",
  year: "1984",
  edition: "",
  condition: "GOOD",
  jacketCondition: "NONE",
};

describe("NFR-004 visible labels", () => {
  it("ties a visible label to every add and edit control", () => {
    const html = renderToStaticMarkup(BookFields({ values: EMPTY_BOOK_FORM }));
    const controls: [string, string][] = [
      ["book-title", "Title"],
      ["book-author", "Author"],
      ["book-isbn", "ISBN"],
      ["book-category", "Category"],
      ["book-publisher", "Publisher"],
      ["book-year", "Year"],
      ["book-edition", "Edition (optional)"],
      ["book-out-of-print", "Out of print"],
      ["book-condition", "Condition"],
      ["book-jacket", "Jacket condition"],
    ];
    for (const [id, label] of controls) {
      expect(html).toContain(`for="${id}"`);
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`>${label}<`);
    }
  });

  it("ties a label to the demo-user switcher", () => {
    const html = renderToStaticMarkup(
      Header({
        users: [{ id: "user_maya", name: "Maya Chen" }],
        activeUserId: "user_maya",
        showBookLinks: true,
        switchAction: () => undefined,
      }),
    );

    expect(html).toContain('for="active-user"');
    expect(html).toContain('id="active-user"');
    expect(html).toContain("Acting as");
  });
});

describe("C4 add and edit forms (FR-017, FR-018, FR-019)", () => {
  it("offers exactly the 7 categories, 5 conditions, and 5 jacket grades with their labels", () => {
    const html = renderToStaticMarkup(BookFields({ values: EMPTY_BOOK_FORM }));
    for (const label of [
      "Architecture Monograph",
      "Architectural Theory",
      "Art History",
      "Exhibition Catalogue",
      "Photography",
      "Design",
      "Artist Book / Zine",
      "Like New",
      "None (no jacket)",
      "Fine",
    ]) {
      expect(html).toContain(`>${label}</option>`);
    }
    expect(html.match(/<option value="[A-Z_]+"/g)).toHaveLength(7 + 5 + 5);
    expect(html).toContain('min="1450"');
    expect(html).toContain(`max="${new Date().getFullYear()}"`);
    expect(html).toContain("We look up the cover on Open Library by ISBN.");
  });

  it("fills the edit form with the stored values", () => {
    const html = renderToStaticMarkup(BookFields({ values: filled }));
    expect(html).toContain('value="ARCHITECTURAL_THEORY" selected=""');
    expect(html).toContain('value="FAIR" selected=""');
    expect(html).toContain('value="POOR" selected=""');
    expect(html).toMatch(/id="book-out-of-print"[^>]*checked=""/);
    expect(html).toContain('value="1972"');
    expect(html).toContain('value="1st ed."');
  });

  it("reads the out-of-print checkbox as true when ticked and false when absent", () => {
    expect(readBookForm(formData({ ...submitted, outOfPrint: "on" })).outOfPrint).toBe(true);
    expect(readBookForm(formData(submitted)).outOfPrint).toBe(false);
  });

  it("rejects a submitted year outside 1450 to this year", () => {
    for (const year of ["1449", String(new Date().getFullYear() + 1), "19x4"]) {
      const result = validateBookFields(toBookInput(readBookForm(formData({ ...submitted, year }))));
      expect(result).toMatchObject({ ok: false, status: 400, message: expect.stringContaining("Year") });
    }
    const ok = validateBookFields(toBookInput(readBookForm(formData({ ...submitted, year: "1450" }))));
    expect(ok.ok).toBe(true);
  });

  it("rejects submitted enum values that are not in the lists", () => {
    const cases: [string, string, string][] = [
      ["category", "FICTION", "Category"],
      ["condition", "USED", "Condition"],
      ["jacketCondition", "MINT", "Jacket condition"],
    ];
    for (const [field, value, named] of cases) {
      const result = validateBookFields(
        toBookInput(readBookForm(formData({ ...submitted, [field]: value }))),
      );
      expect(result).toMatchObject({ ok: false, status: 400, message: expect.stringContaining(named) });
    }
  });
});
