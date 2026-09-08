import { ArrowUp, Loader2, Search } from "lucide-react";
import { useState } from "react";

interface QueryComposerProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

function QueryComposer({
  onSubmit,
  isLoading,
}: QueryComposerProps) {
  const [question, setQuestion] = useState("");

  const submit = () => {
    const trimmed = question.trim();

    if (!trimmed || isLoading) {
      return;
    }

    onSubmit(trimmed);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <section>
      <div className="mb-4">
        <p className="text-xs font-medium text-indigo-400">
          ASK RULEGUARD
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          What does the policy say?
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Ask a question about the indexed university policy corpus.
          RuleGuard retrieves supporting evidence before making a decision.
        </p>
      </div>

      <div className="glass-panel overflow-hidden rounded-2xl shadow-2xl shadow-black/20">
        <div className="flex items-start gap-3 p-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
            <Search className="h-4 w-4 text-indigo-400" />
          </div>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
            placeholder="e.g. I have 68% attendance and approved medical leave. Can I appear for my examination?"
            className="min-h-[76px] flex-1 resize-none bg-transparent text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed"
          />

          <button
            onClick={submit}
            disabled={!question.trim() || isLoading}
            className="mt-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
            title="Submit query"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="border-t border-[#232a42]/70 px-4 py-2.5">
          <span className="text-[10px] text-slate-600">
            Press Enter to submit · Shift + Enter for a new line
          </span>
        </div>
      </div>
    </section>
  );
}

export default QueryComposer;