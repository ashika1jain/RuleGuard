import {
  AlertTriangle,
  FileSearch,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

interface EmptyStateProps {
  onSelectPrompt: (question: string) => void;
}

const examples = [
  {
    label: "Potential conflict",
    question:
      "I have 68% attendance and approved medical leave. Can I appear for my examination?",
  },
  {
    label: "Placement policy",
    question:
      "What happens if I miss a campus recruitment drive after registering?",
  },
  {
    label: "Deadline",
    question:
      "What is the scholarship renewal deadline?",
  },
  {
    label: "Not covered",
    question:
      "What is the university's policy for international student visa sponsorship?",
  },
];

function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <section className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4">
          <FileSearch className="h-4 w-4 text-indigo-400" />

          <h3 className="mt-3 text-xs font-semibold text-slate-200">
            Semantic retrieval
          </h3>

          <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
            FAISS retrieves relevant policy passages using semantic similarity.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <AlertTriangle className="h-4 w-4 text-rose-400" />

          <h3 className="mt-3 text-xs font-semibold text-slate-200">
            Conflict detection
          </h3>

          <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
            Contradictory evidence is surfaced instead of being silently merged.
          </p>
        </div>

        <div className="glass-card rounded-xl p-4">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />

          <h3 className="mt-3 text-xs font-semibold text-slate-200">
            Evidence-first
          </h3>

          <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
            Every decision is connected to retrieved source passages.
          </p>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <MessageSquareText className="h-3.5 w-3.5 text-slate-500" />

          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Try an example
          </span>
        </div>

        <div className="grid gap-2">
          {examples.map((example) => (
            <button
              key={example.question}
              onClick={() => onSelectPrompt(example.question)}
              className="group flex items-center justify-between rounded-xl border border-[#232a42] bg-[#0e111a] px-4 py-3 text-left transition hover:border-indigo-500/30 hover:bg-[#111522]"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-400">
                  {example.label}
                </span>

                <p className="mt-1 truncate text-xs text-slate-300 group-hover:text-white">
                  {example.question}
                </p>
              </div>

              <span className="ml-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-indigo-400">
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EmptyState;