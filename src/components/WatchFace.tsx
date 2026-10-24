export default function WatchFace({ dial, bezel, label }: { dial: string; bezel: string; label: string }) {
  return (
    <svg viewBox="0 0 120 160" className="h-36 w-auto drop-shadow-xl" role="img" aria-label={label}>
      <rect x="40" y="0" width="40" height="40" rx="6" fill="#8d9096" />
      <rect x="40" y="120" width="40" height="40" rx="6" fill="#8d9096" />
      <rect x="104" y="74" width="8" height="12" rx="2" fill="#a7aab0" />
      <circle cx="60" cy="80" r="46" fill="#b9bcc2" />
      <circle cx="60" cy="80" r="42" fill={bezel} />
      <circle cx="60" cy="80" r="34" fill={dial} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        const r1 = i % 3 === 0 ? 25 : 28;
        return (
          <line
            key={i}
            x1={60 + Math.sin(a) * r1}
            y1={80 - Math.cos(a) * r1}
            x2={60 + Math.sin(a) * 31}
            y2={80 - Math.cos(a) * 31}
            stroke="#d9c38a"
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      <line x1="60" y1="80" x2="60" y2="58" stroke="#e8e6df" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="80" x2="77" y2="88" stroke="#e8e6df" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="80" r="2.5" fill="#d9c38a" />
    </svg>
  );
}
