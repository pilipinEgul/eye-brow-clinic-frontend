export default function Loading() {
  return (
    <section className="section">
      <div className="container-x flex flex-col items-center text-center">
        <div className="h-2 w-48 overflow-hidden rounded-full bg-blush-100">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-gold-500" />
        </div>
        <p className="mt-6 font-display text-xl text-ink-700">Polishing the studio…</p>
      </div>
    </section>
  );
}
