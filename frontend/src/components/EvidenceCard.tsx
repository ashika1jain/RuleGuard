import React, { useEffect, useState } from "react";
import {
  FileText,
  Award,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import { EvidenceItem } from "../types";

interface EvidenceCardProps {
  evidence: EvidenceItem;
  index: number;
  isSupporting: boolean;
  isActive?: boolean;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  index,
  isSupporting,
  isActive = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const similarityPct = (evidence.score * 100).toFixed(2);

  const cardId = `evidence-${index}`;

  // Automatically expand when selected from a citation.
  useEffect(() => {
    if (isActive) {
      setIsExpanded(true);
    }
  }, [isActive]);

  const handleCardClick = () => {
    setIsExpanded((previous) => !previous);
  };

  return (
    <div
      id={cardId}
      className={`rounded-xl border transition-all duration-300 ${
        isSupporting
          ? "bg-surface-card border-brand-indigo/60 shadow-lg shadow-brand-indigo/10"
          : "bg-surface-card/60 border-surface-border hover:border-surface-borderHighlight"
      } ${
        isActive
          ? "ring-2 ring-brand-indigo/50"
          : ""
      }`}
    >
      {/* Clickable Evidence Header */}
      <button
        type="button"
        onClick={handleCardClick}
        className="w-full text-left p-4 focus:outline-none"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`shrink-0 px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                isSupporting
                  ? "bg-brand-indigo text-white"
                  : "bg-surface-subtle text-slate-400 border border-surface-border"
              }`}
            >
              [{index + 1}]
            </span>

            {isSupporting && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/30 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3" />
                Used
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              {similarityPct}%
            </span>

            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Source */}
        <div className="mt-3 flex items-center gap-2 min-w-0">
          <FileText className="w-3.5 h-3.5 text-brand-indigo shrink-0" />

          <span
            className="font-mono text-xs text-slate-300 truncate"
            title={evidence.source}
          >
            {evidence.source}
          </span>
        </div>

        {/* Section */}
        <div className="mt-1 text-xs text-slate-500 truncate">
          {evidence.section || "General"}
        </div>

        {/* Similarity Bar */}
        <div className="mt-3">
          <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden border border-surface-border/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isSupporting
                  ? "bg-gradient-to-r from-brand-indigo to-brand-cyan"
                  : "bg-slate-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  evidence.score * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </button>

      {/* Expanded Evidence Content */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="border-t border-surface-border/60 pt-3">
            {/* Metadata */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
              <span className="font-mono">
                PAGE:{" "}
                <span className="text-slate-400">
                  {evidence.page !== null &&
                  evidence.page !== undefined
                    ? evidence.page
                    : "—"}
                </span>
              </span>

              <span className="font-mono">
                RAW SCORE:{" "}
                <span className="text-slate-400">
                  {evidence.score.toFixed(4)}
                </span>
              </span>
            </div>

            {/* Passage */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                Retrieved Passage
              </span>

              <blockquote className="text-xs text-slate-300 font-mono bg-surface-subtle/80 p-3 rounded-lg border border-surface-border leading-relaxed selection:bg-brand-indigo/40">
                "{evidence.text}"
              </blockquote>
            </div>

            {/* Source Indicator */}
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
              <ExternalLink className="w-3 h-3" />

              <span>
                Retrieved from indexed policy corpus
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};