"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/actions/books";
import { BookFields } from "@/components/book-fields";

export function BookForm({
  action,
  values,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  values: {
    bookId?: string;
    title: string;
    author: string;
    isbn: string;
    condition: string;
    genre: string;
  };
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {state.error ? (
        <p role="alert" className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {state.error}
        </p>
      ) : null}
      <BookFields values={values} />
      <button type="submit" className="w-fit rounded bg-stone-900 px-3 py-2 text-sm text-white">
        {submitLabel}
      </button>
    </form>
  );
}
