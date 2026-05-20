const ticker = [
  "DOCUMENT",
  "VERIFY",
  "AMPLIFY",
  "YOUTH VOICE",
  "PUBLIC ISSUES",
  "CREATOR CREDIT",
  "INDIA IS WATCHING"
];

export function WatchTicker() {
  const items = [...ticker, ...ticker, ...ticker];

  return (
    <div className="overflow-hidden bg-ink py-3 text-white shadow-sm">
      <div className="flex w-max animate-ticker gap-5 whitespace-nowrap font-mono text-sm font-black uppercase tracking-[0.2em]">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-6">
            {item}
            <span className="text-saffron">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
