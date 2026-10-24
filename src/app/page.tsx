import WatchCompare from "@/components/WatchCompare";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Watch Compare</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">The top 5 luxury watches</h1>
        <p className="mt-3 max-w-2xl text-ink-2">
          Filter by price, compare specs side by side, and see which ones people are searching for.
        </p>
      </header>
      <WatchCompare />
      <footer className="mt-12 text-xs text-muted">
        Prices are approximate US list and pre-owned market estimates, for orientation only. Search
        interest comes from Google Trends.
      </footer>
    </main>
  );
}
