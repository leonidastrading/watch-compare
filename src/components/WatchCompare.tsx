"use client";

import { useMemo, useState } from "react";
import { PRICE_CEILING, WATCHES, formatUsd, premiumPct, type Watch } from "@/lib/watches";
import TrendsChart, { trendsUrl } from "./TrendsChart";
import Image from "next/image";

type Basis = "retail" | "market";
type Sort = "price-asc" | "price-desc" | "premium" | "name";

const TIMEFRAMES = [
  { value: "today 12-m", label: "12 months" },
  { value: "today 5-y", label: "5 years" },
  { value: "all", label: "Since 2004" },
  { value: "today 3-m", label: "90 days" },
];

const REGIONS = [
  { value: "", label: "Worldwide" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "AE", label: "UAE" },
  { value: "HK", label: "Hong Kong" },
  { value: "JP", label: "Japan" },
];

const BRANDS = [...new Set(WATCHES.map((w) => w.brand))];

const SPECS: { label: string; get: (w: Watch) => string }[] = [
  { label: "Reference", get: (w) => w.reference },
  { label: "Retail (approx.)", get: (w) => formatUsd(w.retail) },
  { label: "Market (approx.)", get: (w) => formatUsd(w.market) },
  { label: "Market vs retail", get: (w) => signed(premiumPct(w)) + "%" },
  { label: "Case", get: (w) => `${w.caseMm} mm` },
  { label: "Material", get: (w) => w.material },
  { label: "Movement", get: (w) => w.movement },
  { label: "Power reserve", get: (w) => `${w.powerReserveH} h` },
  { label: "Water resistance", get: (w) => `${w.waterResistanceM} m` },
  { label: "Introduced", get: (w) => String(w.introduced) },
];

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

export default function WatchCompare() {
  const [basis, setBasis] = useState<Basis>("retail");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(PRICE_CEILING);
  const [brands, setBrands] = useState<string[]>(BRANDS);
  const [sort, setSort] = useState<Sort>("price-asc");
  const [selected, setSelected] = useState<string[]>(WATCHES.map((w) => w.id));
  const [time, setTime] = useState(TIMEFRAMES[1].value);
  const [geo, setGeo] = useState("");

  const filtered = useMemo(() => {
    const list = WATCHES.filter(
      (w) => w[basis] >= min && w[basis] <= max && brands.includes(w.brand),
    );
    return list.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a[basis] - b[basis];
        case "price-desc":
          return b[basis] - a[basis];
        case "premium":
          return premiumPct(b) - premiumPct(a);
        case "name":
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
      }
    });
  }, [basis, min, max, brands, sort]);

  const compared = filtered.filter((w) => selected.includes(w.id));
  const keywords = compared.map((w) => w.trendsKeyword);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleBrand = (b: string) =>
    setBrands((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]));
  const reset = () => {
    setMin(0);
    setMax(PRICE_CEILING);
    setBrands(BRANDS);
    setSelected(WATCHES.map((w) => w.id));
  };

  return (
    <div className="space-y-10">
      {/* Filters */}
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-medium">Filter by price</h2>
          <div className="flex rounded-full border border-border p-1 text-sm">
            {(["retail", "market"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBasis(b)}
                className={`rounded-full px-4 py-1.5 transition ${
                  basis === b ? "bg-accent text-page" : "text-ink-2 hover:text-ink"
                }`}
              >
                {b === "retail" ? "Retail price" : "Market price"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <RangeInput label="Minimum" value={min} onChange={(v) => setMin(Math.min(v, max))} />
          <RangeInput label="Maximum" value={max} onChange={(v) => setMax(Math.max(v, min))} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => toggleBrand(b)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                brands.includes(b)
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-border text-muted hover:text-ink-2"
              }`}
            >
              {b}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3 text-sm">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-ink"
            >
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="premium">Biggest market premium</option>
              <option value="name">Name</option>
            </select>
            <button onClick={reset} className="text-muted underline-offset-4 hover:text-ink hover:underline">
              Reset
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          Showing {filtered.length} of {WATCHES.length} watches between {formatUsd(min)} and{" "}
          {max >= PRICE_CEILING ? `${formatUsd(PRICE_CEILING)}+` : formatUsd(max)} ({basis} price).
        </p>
      </section>

      {/* Cards */}
      <section>
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border py-16 text-center text-muted">
            Nothing in this price range. Widen the filter or hit Reset.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {filtered.map((w, i) => {
              const on = selected.includes(w.id);
              const prem = premiumPct(w);
              return (
                <article
                  key={w.id}
                  className={`flex flex-col overflow-hidden rounded-2xl border bg-surface p-5 transition ${
                    on ? "border-accent/50" : "border-border opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between text-sm text-muted">
                    <span>#{i + 1}</span>
                    <label className="flex cursor-pointer items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(w.id)}
                        className="accent-[var(--accent)]"
                      />
                      Compare
                    </label>
                  </div>
                  <figure className="-mx-5 my-4">
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                      <Image
                        src={w.photo.src}
                        alt={`${w.brand} ${w.model}`}
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        priority={i < 3}
                      />
                    </div>
                    <figcaption className="mt-1.5 px-5 text-xs leading-snug text-muted">
                      {w.photo.pictured && <>Pictured: {w.photo.pictured} · </>}
                      <a href={w.photo.source} target="_blank" rel="noreferrer" className="hover:text-ink-2">
                        {w.photo.credit}, {w.photo.license}
                      </a>
                    </figcaption>
                  </figure>
                  <p className="text-sm uppercase tracking-[0.18em] text-accent">{w.brand}</p>
                  <h3 className="mt-1 font-serif text-2xl font-medium leading-tight">{w.model}</h3>
                  <p className="text-sm text-muted">Ref. {w.reference}</p>
                  <p className="mt-3 flex-1 text-base text-ink-2">{w.blurb}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-lg">
                    <div>
                      <dt className="text-sm text-muted">Retail</dt>
                      <dd className={basis === "retail" ? "font-semibold" : ""}>{formatUsd(w.retail)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted">Market</dt>
                      <dd className={basis === "market" ? "font-semibold" : ""}>{formatUsd(w.market)}</dd>
                    </div>
                  </dl>
                  <span
                    className={`mt-3 self-start rounded-full px-2.5 py-0.5 text-sm ${
                      prem >= 0 ? "bg-gain-bg text-gain" : "bg-loss-bg text-loss"
                    }`}
                  >
                    {signed(prem)}% vs retail
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Google Trends */}
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-medium">Google search interest</h2>
            <p className="text-sm text-muted">
              Google Trends for the watches you&apos;re comparing (100 = peak popularity).
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-lg border border-border bg-surface-2 px-3 py-1.5"
            >
              {TIMEFRAMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              value={geo}
              onChange={(e) => setGeo(e.target.value)}
              className="rounded-lg border border-border bg-surface-2 px-3 py-1.5"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <TrendsChart keywords={keywords} time={time} geo={geo} />
        </div>
        {keywords.length > 0 && (
          <a
            href={trendsUrl(keywords, time, geo)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline"
          >
            Open this comparison on Google Trends ↗
          </a>
        )}
      </section>

      {/* Spec table */}
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="font-serif text-2xl font-medium">Side by side</h2>
        {compared.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Tick “Compare” on a watch to add it here.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-base">
              <thead>
                <tr className="text-left">
                  <th className="w-40 py-2 pr-4 font-normal text-muted" />
                  {compared.map((w) => (
                    <th key={w.id} className="py-2 pr-4 align-bottom font-normal">
                      <span className="block text-xs uppercase tracking-widest text-accent">{w.brand}</span>
                      <span className="font-serif text-lg font-medium">{w.model}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPECS.map((s) => (
                  <tr key={s.label} className="border-t border-border">
                    <td className="py-2.5 pr-4 text-muted">{s.label}</td>
                    {compared.map((w) => (
                      <td key={w.id} className="py-2.5 pr-4 tabular-nums">
                        {s.get(w)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function RangeInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <input
          type="number"
          min={0}
          max={PRICE_CEILING}
          step={1000}
          value={value}
          onChange={(e) => onChange(Math.max(0, Math.min(PRICE_CEILING, Number(e.target.value) || 0)))}
          className="w-32 rounded-lg border border-border bg-surface-2 px-2 py-1 text-right tabular-nums"
        />
      </div>
      <input
        type="range"
        min={0}
        max={PRICE_CEILING}
        step={1000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--accent)]"
      />
    </label>
  );
}
