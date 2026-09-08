import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  ShieldAlert,
} from "lucide-react";

import type { AskResponse } from "../types";
import ConflictVisualizer from "./ConflictVisualizer";

interface ResultViewProps {
  response: AskResponse;
  onCitationClick: (index: number) => void;
}

function ResultView({
  response,
  onCitationClick,
}: ResultViewProps) {
  const isAnswered = response.classification === "ANSWERED";
  const isConflict = response.classification === "CONFLICT";

  return (
    <section className="space-y-5">
      {/* Question */}
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Your question
        </span>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {response.question}
        </p>
      </div>

      {/* Decision */}
      <div
        className={`rounded-2xl border p-5 ${
          isConflict
            ? "border-rose-500/30 bg-rose-500/[0.06]"
            : isAnswered
              ? "border-emerald-500/25 bg-emerald-500/[0.05]"
              : "border-amber-500/30 bg-amber-500/[0.05]"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isConflict
                ? "bg-rose-500/10 text-rose-400"
                : isAnswered
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {isConflict ? (
              <ShieldAlert className="h-5 w-5" />
            ) : isAnswered ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <FileWarning className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-1 font-mono text-[10px] font-semibold ${
                  isConflict
                    ? "bg-rose-500/10 text-rose-300"
                    : isAnswered
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-amber-500/10 text-amber-300"
                }`}
              >
                {response.classification}
              </span>

              <span className="text-[10px] text-slate-600">
                Decision from retrieved evidence
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-200">
              {response.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Conflict */}
      {isConflict && (
        <ConflictVisualizer
          evidence={response.evidence}
          supportingIndices={response.supporting_evidence}
          onCitationClick={onCitationClick}
        />
      )}

      {/* Evidence citations */}
      <div className="rounded-2xl border border-[#232a42] bg-[#0e111a] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Evidence used
            </h3>

            <p className="mt-1 text-[11px] text-slate-500">
              Click a citation to inspect the source passage.
            </p>
          </div>

          <span className="rounded-md bg-[#161b2c] px-2 py-1 font-mono text-[10px] text-slate-500">
            {response.supporting_evidence.length} cited
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {response.supporting_evidence.map((index) => {
            const evidence = response.evidence[index - 1] ?? response.evidence[index];

            if (!evidence) {
              return null;
            }

            return (
              <button
                key={index}
                onClick={() => onCitationClick(index)}
                className="flex items-center gap-2 rounded-lg border border-[#232a42] bg-[#111522] px-3 py-2 text-left transition hover:border-indigo-500/40 hover:bg-[#161b2c]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-500/10 font-mono text-[9px] text-indigo-300">
                  [{index}]
                </span>

                <span className="max-w-[280px] truncate text-[11px] text-slate-400">
                  {evidence.source} · {evidence.section}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Not covered explanation */}
      {response.classification === "NOT_COVERED" && (
        <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

          <p className="text-xs leading-5 text-slate-400">
            RuleGuard did not find sufficient supporting policy evidence for
            this question. The system deliberately avoids inventing an answer
            from unrelated retrieved passages.
          </p>
        </div>
      )}
    </section>
  );
}

export default ResultView;