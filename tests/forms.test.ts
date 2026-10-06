import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/header";
import { BookFields } from "@/components/book-fields";

describe("NFR-004 visible labels", () => {
  it("ties a label to every add and edit control", () => {
    const html = renderToStaticMarkup(
      BookFields({
        values: {
          title: "Clean Code",
          author: "Robert C. Martin",
          isbn: "9780132350884",
          condition: "GOOD",
          genre: "Software",
        },
      }),
    );

    for (const id of ["book-title", "book-author", "book-isbn", "book-condition", "book-genre"]) {
      expect(html).toContain(`for="${id}"`);
      expect(html).toContain(`id="${id}"`);
    }
    expect(html).toContain(">Title<");
    expect(html).toContain(">Author<");
    expect(html).toContain(">ISBN<");
    expect(html).toContain(">Condition<");
    expect(html).toContain(">Genre<");
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
