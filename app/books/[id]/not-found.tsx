export default function BookNotFound() {
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">That book is not listed.</h1>
      <p className="mt-4">
        <a href="/" className="underline underline-offset-4">
          Back to Browse
        </a>
      </p>
    </section>
  );
}
