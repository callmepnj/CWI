import { FileCheck2, Megaphone, ShieldCheck } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";

const promises = [
  {
    title: "Document",
    body: "We collect public context and source links.",
    icon: FileCheck2
  },
  {
    title: "Verify",
    body: "We separate facts, reports, claims, and speculation.",
    icon: ShieldCheck
  },
  {
    title: "Amplify",
    body: "We publish responsibly with credit and context.",
    icon: Megaphone
  }
];

export function WatchVerificationPromise() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {promises.map((promise) => {
        const Icon = promise.icon;

        return (
          <Card key={promise.title} className="h-full">
            <CardLabel>Verification Promise</CardLabel>
            <Icon className="h-8 w-8 text-royal" />
            <h3 className="mt-5 font-display text-3xl font-black uppercase tracking-[-0.04em] text-ink">
              {promise.title}
            </h3>
            <p className="mt-4 leading-7 text-ink/70">{promise.body}</p>
          </Card>
        );
      })}
    </div>
  );
}
