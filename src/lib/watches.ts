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
  blurb: string;
  photo: Photo;
};

export type Photo = {
  src: string;
  /** Wikimedia Commons file page. */
  source: string;
  credit: string;
  license: string;
  /** Set when the photo shows a sibling reference rather than the exact one. */
  pictured?: string;
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
    blurb: "The reference dive watch. Ceramic bezel, Glidelock clasp, strong resale.",
    photo: {
      src: "/watches/submariner.webp",
      source: "https://commons.wikimedia.org/wiki/File:Rolex_Submariner_Professional.JPG",
      credit: "Dr.K.",
      license: "CC BY-SA 3.0",
      pictured: "an earlier reference",
    },
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
    blurb: "The most waitlisted steel chronograph. Trades well above retail.",
    photo: {
      src: "/watches/daytona.webp",
      source: "https://commons.wikimedia.org/wiki/File:RolexDaytona.jpg",
      credit: "Lutherian",
      license: "CC BY-SA 3.0",
      pictured: "an earlier steel reference",
    },
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
    blurb: "Flown to the Moon. Hand-wound, Master Chronometer, buyable at retail.",
    photo: {
      src: "/watches/speedmaster.webp",
      source: "https://commons.wikimedia.org/wiki/File:OMEGA-Speedmaster-Professional-Front.jpg",
      credit: "Torsten Bolten",
      license: "Public domain",
      pictured: "an earlier reference",
    },
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
    blurb: "Gérald Genta's octagonal icon with the Grande Tapisserie dial.",
    photo: {
      src: "/watches/royal-oak.webp",
      source: "https://commons.wikimedia.org/wiki/File:Audemars_Piguet_Royal_Oak_ref._15202.jpg",
      credit: "OpaleHorse",
      license: "CC BY-SA 4.0",
      pictured: "ref. 15202 “Jumbo”",
    },
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
    blurb: "Successor to the 5711. The grail of the integrated-bracelet sports watch.",
    photo: {
      src: "/watches/nautilus.webp",
      source: "https://commons.wikimedia.org/wiki/File:Patek-Philippe-Nautilus-5711-1A-010-1.jpg",
      credit: "Patek Philippe SA",
      license: "CC BY-SA 4.0",
      pictured: "ref. 5711/1A",
    },
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
