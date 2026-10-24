export type Watch = {
  id: string;
  brand: string;
  model: string;
  reference: string;
  /** Search term used for Google Trends. */
  trendsKeyword: string;
  /** Approximate US list price, USD. */
  retail: number;
  /** Approximate pre-owned / grey-market price, USD. */
  market: number;
  caseMm: number;
  material: string;
  movement: string;
  powerReserveH: number;
  waterResistanceM: number;
  introduced: number;
  dial: string;
  bezel: string;
  blurb: string;
};

// Prices are rounded estimates for orientation only; check an authorized
// dealer or a live marketplace before buying.
export const WATCHES: Watch[] = [
  {
    id: "submariner",
    brand: "Rolex",
    model: "Submariner Date",
    reference: "126610LN",
    trendsKeyword: "Rolex Submariner",
    retail: 10_900,
    market: 13_500,
    caseMm: 41,
    material: "Oystersteel",
    movement: "Cal. 3235 automatic",
    powerReserveH: 70,
    waterResistanceM: 300,
    introduced: 1953,
    dial: "#111214",
    bezel: "#1b1c1f",
    blurb: "The reference dive watch. Ceramic bezel, Glidelock clasp, strong resale.",
  },
  {
    id: "daytona",
    brand: "Rolex",
    model: "Cosmograph Daytona",
    reference: "126500LN",
    trendsKeyword: "Rolex Daytona",
    retail: 16_300,
    market: 28_500,
    caseMm: 40,
    material: "Oystersteel",
    movement: "Cal. 4131 automatic chronograph",
    powerReserveH: 72,
    waterResistanceM: 100,
    introduced: 1963,
    dial: "#f4f2ec",
    bezel: "#121212",
    blurb: "The most waitlisted steel chronograph. Trades well above retail.",
  },
  {
    id: "speedmaster",
    brand: "Omega",
    model: "Speedmaster Moonwatch Professional",
    reference: "310.30.42.50.01.002",
    trendsKeyword: "Omega Speedmaster",
    retail: 7_600,
    market: 6_200,
    caseMm: 42,
    material: "Stainless steel",
    movement: "Cal. 3861 manual chronograph",
    powerReserveH: 50,
    waterResistanceM: 50,
    introduced: 1957,
    dial: "#0f0f10",
    bezel: "#1a1a1a",
    blurb: "Flown to the Moon. Hand-wound, Master Chronometer, buyable at retail.",
  },
  {
    id: "royal-oak",
    brand: "Audemars Piguet",
    model: "Royal Oak Selfwinding",
    reference: "15510ST",
    trendsKeyword: "Audemars Piguet Royal Oak",
    retail: 31_000,
    market: 44_000,
    caseMm: 41,
    material: "Stainless steel",
    movement: "Cal. 4302 automatic",
    powerReserveH: 70,
    waterResistanceM: 50,
    introduced: 1972,
    dial: "#24365a",
    bezel: "#9aa0a8",
    blurb: "Gérald Genta's octagonal icon with the Grande Tapisserie dial.",
  },
  {
    id: "nautilus",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5811/1G",
    trendsKeyword: "Patek Philippe Nautilus",
    retail: 73_000,
    market: 135_000,
    caseMm: 41,
    material: "18k white gold",
    movement: "Cal. 26-330 S C automatic",
    powerReserveH: 45,
    waterResistanceM: 120,
    introduced: 1976,
    dial: "#2b4a6f",
    bezel: "#c9ccd1",
    blurb: "Successor to the 5711. The grail of the integrated-bracelet sports watch.",
  },
];

export const PRICE_CEILING = 150_000;

export function premiumPct(w: Watch): number {
  return Math.round(((w.market - w.retail) / w.retail) * 100);
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
