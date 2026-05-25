import Link from "next/link";
import { HelpCircle, MessageSquareText } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/card";

type ArticleDiscussionPromptsProps = {
  prompts: string[];
  questions: string[];
  correctionHref?: string;
};

export function ArticleDiscussionPrompts({
  prompts,
  questions,
  correctionHref = "/submit"
}: ArticleDiscussionPromptsProps) {
  return (
    <Card className="mt-8">
      <CardLabel>CWI discussion prompts</CardLabel>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-black uppercase tracking-[-0.03em] text-ink">
            Add context, not noise
          </h2>
          <p className="mt-3 leading-7 text-ink/70">
            These prompts are written by Cockroach Watch India to guide useful public discussion. They are not user comments, reviews, or endorsements.
          </p>
          <div className="mt-5 grid gap-3">
            {prompts.map((prompt) => (
              <div key={prompt} className="flex gap-3 rounded-2xl border border-line bg-paper p-4">
                <MessageSquareText className="mt-1 h-4 w-4 shrink-0 text-royal" />
                <p className="text-sm font-semibold leading-6 text-ink/72">{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em] text-ink">
            Reader questions to consider
          </h3>
          <div className="mt-5 grid gap-3">
            {questions.map((question) => (
              <div key={question} className="flex gap-3 rounded-2xl bg-skywash p-4">
                <HelpCircle className="mt-1 h-4 w-4 shrink-0 text-royal" />
                <p className="text-sm font-bold leading-6 text-ink/72">{question}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold leading-6 text-ink/62">
            Have a source, correction, or creator credit request?{" "}
            <Link href={correctionHref} className="font-black text-royal underline-offset-4 hover:underline">
              Submit it to CWI
            </Link>
            .
          </p>
        </div>
      </div>
    </Card>
  );
}
