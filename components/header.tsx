export function Header({
  users,
  activeUserId,
  showBookLinks = false,
  switchAction,
}: {
  users: { id: string; name: string }[];
  activeUserId: string;
  showBookLinks?: boolean;
  switchAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <header className="border-b border-stone-300 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <a href="/" className="text-lg font-semibold tracking-tight text-stone-950">
            Easy Exchange
          </a>
          {showBookLinks ? (
            <nav className="mt-2 flex flex-wrap gap-4 text-sm text-stone-700">
              <a href="/" className="underline-offset-4 hover:underline">
                Browse
              </a>
              <a href="/shelf" className="underline-offset-4 hover:underline">
                My shelf
              </a>
              <a href="/books/new" className="underline-offset-4 hover:underline">
                Add a book
              </a>
            </nav>
          ) : null}
        </div>
        <form action={switchAction} className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="active-user" className="text-sm font-medium text-stone-800">
              Acting as
            </label>
            <select
              id="active-user"
              name="userId"
              defaultValue={activeUserId}
              className="rounded border border-stone-400 bg-white px-2 py-1 text-sm"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded bg-stone-900 px-3 py-1 text-sm text-white"
          >
            Switch
          </button>
        </form>
      </div>
    </header>
  );
}
