"use client";

import { useState } from "react";
import { Card, CardLabel } from "@/components/ui/card";

const options = ["Meme", "Movement", "Both", "Too early to tell"];

export function PollCard() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card>
      <CardLabel>Youth Voice Poll</CardLabel>
      <h3 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.04em] text-ink">Meme or Movement?</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`rounded-2xl border px-4 py-4 text-left font-black uppercase tracking-[0.1em] transition ${
              selected === option ? "border-royal bg-skywash text-royal" : "border-line bg-paper hover:bg-skywash"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm font-bold uppercase leading-6 tracking-[0.06em] text-ink/62">
        {selected ? `Recorded locally in this session: ${selected}.` : "This frontend poll is a UI placeholder until backend analytics are connected."}
      </p>
    </Card>
  );
}
