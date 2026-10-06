"use server";

import { redirect } from "next/navigation";
import { readActiveUser } from "@/app/actions/session";
import { createBook, deleteBook, updateBook } from "@/lib/books";
import type { BookFieldsInput } from "@/lib/validation";

export type FormState = { error: string };

function readBookForm(formData: FormData): BookFieldsInput {
  return {
    title: String(formData.get("title") ?? ""),
    author: String(formData.get("author") ?? ""),
    isbn: String(formData.get("isbn") ?? ""),
    condition: String(formData.get("condition") ?? ""),
    genre: String(formData.get("genre") ?? ""),
  };
}

export async function createBookAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await readActiveUser();
  if (!user) return { error: "No demo user is available." };

  const result = await createBook(user.id, readBookForm(formData));
  if (!result.ok) return { error: result.message };
  redirect("/shelf");
}

export async function updateBookAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await readActiveUser();
  if (!user) return { error: "No demo user is available." };

  const bookId = String(formData.get("bookId") ?? "");
  const result = await updateBook(user.id, bookId, readBookForm(formData));
  if (!result.ok) return { error: result.message };
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
