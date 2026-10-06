"use server";

import { redirect } from "next/navigation";
import { readActiveUser } from "@/app/actions/session";
import { createBook, deleteBook, updateBook } from "@/lib/books";
import { readBookForm, toBookInput, type BookFormValues } from "@/lib/book-form";

export type FormState = { error: string; values?: BookFormValues; attempt?: number };

function failed(prev: FormState, message: string, values: BookFormValues): FormState {
  return { error: message, values, attempt: (prev.attempt ?? 0) + 1 };
}

export async function createBookAction(prev: FormState, formData: FormData): Promise<FormState> {
  const values = readBookForm(formData);
  const user = await readActiveUser();
  if (!user) return failed(prev, "No demo user is available.", values);

  const result = await createBook(user.id, toBookInput(values));
  if (!result.ok) return failed(prev, result.message, values);
  redirect("/shelf");
}

export async function updateBookAction(prev: FormState, formData: FormData): Promise<FormState> {
  const values = readBookForm(formData);
  const user = await readActiveUser();
  if (!user) return failed(prev, "No demo user is available.", values);

  const bookId = String(formData.get("bookId") ?? "");
  const result = await updateBook(user.id, bookId, toBookInput(values));
  if (!result.ok) return failed(prev, result.message, values);
  redirect("/shelf");
}

export async function deleteBookAction(formData: FormData) {
  const user = await readActiveUser();
  const bookId = String(formData.get("bookId") ?? "");
  if (!user) redirect("/");

  const result = await deleteBook(user.id, bookId);
  if (!result.ok) {
    redirect(`/books/${bookId}/edit?error=${encodeURIComponent(result.message)}`);
  }
  redirect("/shelf");
}
