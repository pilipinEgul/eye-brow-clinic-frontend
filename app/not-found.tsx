import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x text-center">
        <div className="eyebrow">404 · Page not found</div>
        <h1 className="mt-3 font-display text-5xl text-ink-900 sm:text-6xl">
          That page slipped out of the studio.
        </h1>
        <p className="mt-4 text-ink-500">
          The page you’re looking for might have moved or never existed. Let’s
          get you back to something beautiful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/services" className="btn btn-secondary">
            View services
          </Link>
        </div>
      </div>
    </section>
  );
}
