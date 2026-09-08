import React, { useState } from "react";
import {
  ShieldCheck,
  Filter,
  FileText,
  ArrowUpDown,
} from "lucide-react";

import { EvidenceItem } from "../types";
import { EvidenceCard } from "./EvidenceCard";

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  supportingIndices: number[];
  activeCitationIndex: number | null;
}

const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  supportingIndices,
  activeCitationIndex,
}) => {
  const [filterSupportingOnly, setFilterSupportingOnly] =
    useState(false);

  const [sortByScore, setSortByScore] =
    useState(true);

  if (!evidence || evidence.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-workspace/50">
        <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-slate-500 mb-3">
          <FileText className="w-6 h-6" />
        </div>

        <h4 className="text-sm font-semibold text-slate-300">
          No Evidence Retrieved
        </h4>

        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Evidence passages, policy files, section numbers,
          and similarity rankings will display here.
        </p>
      </div>
    );
  }

  const indexedList = evidence.map(
    (item, originalIndex) => ({
      item,
      originalIndex,
      isSupporting:
        supportingIndices.includes(originalIndex) ||
        supportingIndices.includes(originalIndex + 1),
    })
  );

  const filtered = filterSupportingOnly
    ? indexedList.filter(
        (entry) => entry.isSupporting
      )
    : indexedList;

  const sorted = [...filtered].sort((a, b) => {
    if (sortByScore) {
      return b.item.score - a.item.score;
    }

    return a.originalIndex - b.originalIndex;
  });

  return (
    <div className="h-full flex flex-col bg-workspace">
      {/* Header */}
      <div className="p-4 border-b border-surface-border flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-cyan" />
              Evidence
            </h3>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-subtle border border-surface-border text-slate-400">
              {evidence.length} passages
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-0.5">
            Retrieved source material
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() =>
              setSortByScore(!sortByScore)
            }
            className={`p-1.5 rounded-md text-xs border transition-colors ${
              sortByScore
                ? "bg-surface-subtle border-surface-borderHighlight text-slate-200"
                : "border-surface-border text-slate-500 hover:text-slate-300"
            }`}
            title={
              sortByScore
                ? "Sorted by Similarity Score"
                : "Sorted by Corpus Sequence"
            }
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() =>
              setFilterSupportingOnly(
                !filterSupportingOnly
              )
            }
            className={`px-2.5 py-1 rounded-md text-xs border transition-colors flex items-center gap-1 font-medium ${
              filterSupportingOnly
                ? "bg-brand-indigo/15 border-brand-indigo/40 text-brand-indigo"
                : "border-surface-border text-slate-400 hover:text-slate-200"
            }`}
            title={
              filterSupportingOnly
                ? "Showing only evidence used by the decision"
                : "Show all retrieved evidence"
            }
          >
            <Filter className="w-3 h-3" />

            <span>
              {filterSupportingOnly
                ? "Used only"
                : "All"}
            </span>
          </button>
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sorted.map(
          ({
            item,
            originalIndex,
            isSupporting,
          }) => {
            const isActive =
              activeCitationIndex ===
              originalIndex;

            return (
              <EvidenceCard
                key={originalIndex}
                evidence={item}
                index={originalIndex}
                isSupporting={isSupporting}
                isActive={isActive}
              />
            );
          }
        )}

        {sorted.length === 0 && (
          <div className="text-center py-10 text-xs text-slate-500">
            No supporting evidence marked in decision.
          </div>
        )}
      </div>
    </div>
  );
};

export default EvidencePanel;