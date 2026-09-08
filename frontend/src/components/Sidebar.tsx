import {
  AlertOctagon,
  ChevronRight,
  Cpu,
  ExternalLink,
  FileText,
  Layers,
  PlusCircle,
  Sparkles,
} from "lucide-react";

import type {
  BackendConnectionStatus,
  QueryRecord,
} from "../types";

interface SidebarProps {
  recentQueries: QueryRecord[];
  onSelectQuery: (record: QueryRecord) => void;
  backendStatus: BackendConnectionStatus;
  onHowItWorks: () => void;
  onNewQuery: () => void;
}

function Sidebar({
  recentQueries,
  onSelectQuery,
  backendStatus,
  onHowItWorks,
  onNewQuery,
}: SidebarProps) {

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-[#232a42] bg-[#0e111a] lg:flex">

      {/* Logo / Header */}
      <div className="border-b border-[#232a42] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">

            <span className="text-lg font-bold text-white">
              ◈
            </span>

          </div>

          <div>

            <h1 className="flex items-center gap-2 text-sm font-bold tracking-wider text-slate-100">

              RULEGUARD

              <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[9px] text-indigo-300">
                v2.0
              </span>

            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Policy Intelligence
            </p>

          </div>

        </div>


        {/* New Policy Query */}
        <button
          onClick={onNewQuery}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-3.5 py-2.5 text-xs font-medium text-slate-950 shadow-sm transition hover:bg-white active:scale-[0.98]"
        >
          <PlusCircle className="h-4 w-4" />
          New Policy Query
        </button>

      </div>


      {/* Sidebar Content */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">

        {/* Recent Queries */}
        <section>

          <div className="mb-2 flex items-center justify-between px-2">

            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Recent Inquiries
            </span>

            {recentQueries.length > 0 && (
              <span className="rounded bg-[#161b2c] px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                {recentQueries.length}
              </span>
            )}

          </div>


          {recentQueries.length === 0 ? (

            <div className="rounded-lg border border-dashed border-[#232a42] px-3 py-4 text-center">

              <p className="text-xs text-slate-500">
                No session queries yet.
              </p>

              <p className="mt-0.5 text-[11px] text-slate-600">
                Submitted questions appear here.
              </p>

            </div>

          ) : (

            <div className="space-y-1">

              {recentQueries.map((record) => {

                const dotColor =
                  record.classification === "ANSWERED"
                    ? "bg-emerald-500"
                    : record.classification === "CONFLICT"
                      ? "bg-rose-500"
                      : "bg-amber-500";

                return (

                  <button
                    key={record.id}
                    onClick={() =>
                      onSelectQuery(record)
                    }
                    className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-slate-400 transition-colors hover:bg-[#161b2c] hover:text-slate-200"
                  >

                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`}
                    />

                    <span className="flex-1 truncate font-medium">
                      {record.question}
                    </span>

                    <ChevronRight className="h-3 w-3 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />

                  </button>

                );
              })}

            </div>

          )}

        </section>


        {/* Indexed Corpus */}
        <section className="border-t border-[#232a42]/60 pt-4">

          <div className="mb-2.5 flex items-center justify-between px-2">

            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Indexed Corpus
            </span>

            <span className="flex items-center gap-1 font-mono text-[10px] text-cyan-400">

              <span className="h-1 w-1 rounded-full bg-cyan-400" />

              Live Index

            </span>

          </div>


          <div className="space-y-1.5 px-1">

            {/* Sources */}
            <div className="flex items-center justify-between rounded-md border border-[#232a42]/80 bg-[#161b2c] px-3 py-2">

              <span className="flex items-center gap-2 text-xs text-slate-400">

                <FileText className="h-3.5 w-3.5 text-indigo-400" />

                Active Sources

              </span>

              <span className="font-mono text-xs font-semibold text-slate-200">
                9 Sources
              </span>

            </div>


            {/* Indexed Volume */}
            <div className="flex items-center justify-between rounded-md border border-[#232a42]/80 bg-[#161b2c] px-3 py-2">

              <span className="flex items-center gap-2 text-xs text-slate-400">

                <Layers className="h-3.5 w-3.5 text-cyan-400" />

                Indexed Volume

              </span>

              <span className="font-mono text-xs font-semibold text-slate-200">
                6,241+ words
              </span>

            </div>


            {/* Conflict Benchmarks */}
            <div className="flex items-center justify-between rounded-md border border-[#232a42]/80 bg-[#161b2c] px-3 py-2">

              <span className="flex items-center gap-2 text-xs text-slate-400">

                <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />

                Conflict Benchmarks

              </span>

              <span className="font-mono text-xs font-semibold text-slate-200">
                3 tests
              </span>

            </div>

          </div>

        </section>


        {/* How RuleGuard Works */}
        <section className="border-t border-[#232a42]/60 pt-4">

          <button
            onClick={onHowItWorks}
            className="flex w-full items-center justify-between rounded-md border border-[#232a42] bg-[#161b2c]/50 px-3 py-2 text-xs text-slate-300 transition-colors hover:bg-[#161b2c]"
          >

            <span className="flex items-center gap-2">

              <Sparkles className="h-3.5 w-3.5 text-violet-400" />

              How RuleGuard Works

            </span>

            <ExternalLink className="h-3 w-3 text-slate-500" />

          </button>

        </section>

      </div>


      {/* Bottom Status */}
      <div className="space-y-3 border-t border-[#232a42] bg-[#0b0e15]/60 p-4">

        <div className="space-y-1.5">

          {/* RAG Engine */}
          <div className="flex items-center justify-between text-[11px]">

            <span className="font-medium text-slate-500">
              RAG Engine
            </span>

            <span className="flex items-center gap-1 font-mono font-semibold text-slate-300">

              <Cpu className="h-3 w-3 text-indigo-400" />

              FAISS + MiniLM

            </span>

          </div>


          {/* Reasoning Model */}
          <div className="flex items-center justify-between text-[11px]">

            <span className="font-medium text-slate-500">
              Reasoning Model
            </span>

            <span className="flex items-center gap-1 font-mono font-semibold text-slate-300">

              <Sparkles className="h-3 w-3 text-violet-400" />

              Gemini

            </span>

          </div>

        </div>


        {/* Backend Status */}
        <div className="flex items-center justify-between border-t border-[#232a42]/50 pt-2">

          <div className="flex items-center gap-2">

            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === "connected"
                  ? "bg-emerald-500"
                  : backendStatus === "checking"
                    ? "animate-pulse bg-amber-400"
                    : "bg-rose-500"
              }`}
            />

            <span className="text-[11px] text-slate-400">

              {backendStatus === "connected"
                ? "Backend connected"
                : backendStatus === "checking"
                  ? "Checking backend..."
                  : "Backend unreachable"}

            </span>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;