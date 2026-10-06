import type { Metadata } from "next";
import { Header } from "@/components/header";
import { listUsers, readActiveUser, setActiveUserAction } from "@/app/actions/session";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Easy Exchange",
  description: "Swap a book you own for a book another student owns.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const users = await listUsers();
  const active = await readActiveUser();

  return (
    <html lang="en">
      <body className="bg-stone-100 text-stone-900 antialiased">
        {active ? (
          <Header
            users={users}
            activeUserId={active.id}
            showBookLinks={false}
            switchAction={setActiveUserAction}
          />
        ) : (
          <header className="border-b border-stone-300 bg-white">
            <div className="mx-auto max-w-3xl px-4 py-4">
              <p className="text-lg font-semibold">Easy Exchange</p>
              <p className="mt-1 text-sm text-stone-700">
                No demo user yet. Seed the database, then reload.
              </p>
            </div>
          </header>
        )}
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
