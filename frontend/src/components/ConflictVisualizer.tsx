import { AlertTriangle, ArrowRight, Scale } from "lucide-react";

import type { EvidenceItem } from "../types";

interface ConflictVisualizerProps {
  evidence: EvidenceItem[];
  supportingIndices: number[];
  onCitationClick: (index: number) => void;
}

function ConflictVisualizer({
  evidence,
  supportingIndices,
  onCitationClick,
}: ConflictVisualizerProps) {
  const items = supportingIndices
    .map((index) => ({
      index,
      evidence: evidence[index - 1] ?? evidence[index],
    }))
    .filter(
      (
        item
      ): item is { index: number; evidence: EvidenceItem } =>
        Boolean(item.evidence)
    )
    .slice(0, 2);

  if (items.length < 2) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-rose-500/25 bg-[#0e111a]">
      <div className="border-b border-rose-500/15 bg-rose-500/[0.04] px-5 py-4">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-rose-400" />

          <h3 className="text-sm font-semibold text-slate-200">
            Conflict detected
          </h3>
        </div>

        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          Retrieved policy provisions provide incompatible guidance for this
          question. RuleGuard surfaces both instead of choosing silently.
        </p>
      </div>

      <div className="grid gap-px bg-[#232a42] md:grid-cols-2">
        {items.map(({ index, evidence: item }, position) => (
          <button
            key={index}
            onClick={() => onCitationClick(index)}
            className="bg-[#0e111a] p-5 text-left transition hover:bg-[#111522]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/10 font-mono text-[10px] text-rose-300">
                  [{index}]
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Provision {position === 0 ? "A" : "B"}
                </span>
              </span>

              <ArrowRight className="h-3.5 w-3.5 text-slate-700" />
            </div>

            <p className="line-clamp-5 text-xs leading-5 text-slate-400">
              {item.text}
            </p>

            <div className="mt-4 border-t border-[#232a42]/70 pt-3">
              <p className="truncate text-[10px] font-medium text-slate-500">
                {item.source}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-600">
                {item.section}
                {item.page !== null && ` · Page ${item.page}`}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ConflictVisualizer;