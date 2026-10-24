"use client";

import { useEffect, useRef, useState } from "react";

// Google's public embed loader. Server-side Trends requests get rate-limited
// (429) from datacenter IPs, so the widget runs in the visitor's browser.
const LOADER_SRC = "https://ssl.gstatic.com/trends_nrtr/4622_RC01/embed_loader.js";

type TrendsEmbed = {
  embed: {
    renderExploreWidgetTo: (
      el: HTMLElement,
      type: string,
      req: unknown,
      opts: { exploreQuery: string; guestPath: string },
    ) => void;
  };
};

declare global {
  interface Window {
    trends?: TrendsEmbed;
  }
}

let loader: Promise<void> | null = null;
function loadTrends(): Promise<void> {
  if (window.trends) return Promise.resolve();
  loader ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = LOADER_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loader = null;
      reject(new Error("Google Trends failed to load"));
    };
    document.head.appendChild(s);
  });
  return loader;
}

export function trendsUrl(keywords: string[], time: string, geo: string): string {
  const q = new URLSearchParams({ q: keywords.join(","), date: time });
  if (geo) q.set("geo", geo);
  return `https://trends.google.com/trends/explore?${q}`;
}

export default function TrendsChart({
  keywords,
  time,
  geo,
}: {
  keywords: string[];
  time: string;
  geo: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const key = `${keywords.join("|")}#${time}#${geo}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || keywords.length === 0) return;
    let cancelled = false;
    el.innerHTML = "";
    loadTrends()
      .then(() => {
        if (cancelled || !window.trends) return;
        setError(false);
        const exploreQuery = new URLSearchParams({ q: keywords.join(","), date: time });
        if (geo) exploreQuery.set("geo", geo);
        window.trends.embed.renderExploreWidgetTo(
          el,
          "TIMESERIES",
          {
            comparisonItem: keywords.map((keyword) => ({ keyword, geo, time })),
            category: 0,
            property: "",
          },
          {
            exploreQuery: exploreQuery.toString(),
            guestPath: "https://trends.google.com:443/trends/embed/",
          },
        );
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
      el.innerHTML = "";
    };
    // `key` captures every input; the array identity changes each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (keywords.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        No watches match the current filter.
      </p>
    );
  }

  return (
    <div>
      {error && (
        <p className="py-10 text-center text-sm text-muted">
          The Google Trends widget couldn&apos;t load (an ad blocker may be stopping it).{" "}
          <a className="text-accent underline" href={trendsUrl(keywords, time, geo)} target="_blank" rel="noreferrer">
            Open on Google Trends
          </a>
        </p>
      )}
      <div ref={ref} className="min-h-[360px] rounded-lg bg-white" />
    </div>
  );
}
