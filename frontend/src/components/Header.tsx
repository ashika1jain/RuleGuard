import { Info, ShieldCheck } from "lucide-react";

import type { BackendConnectionStatus } from "../types";

interface HeaderProps {
  backendStatus: BackendConnectionStatus;
  onHowItWorks: () => void;
}

function Header({ backendStatus, onHowItWorks }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#232a42] bg-[#0b0e15]/90 px-6 backdrop-blur-xl">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Policy Intelligence Workspace
        </p>

        <h2 className="mt-0.5 text-sm font-semibold text-slate-100">
          Evidence-first policy analysis
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-[#232a42] bg-[#111522] px-3 py-2 sm:flex">
          <ShieldCheck
            className={`h-3.5 w-3.5 ${
              backendStatus === "connected"
                ? "text-emerald-400"
                : backendStatus === "checking"
                  ? "text-amber-400"
                  : "text-rose-400"
            }`}
          />

          <span className="text-[11px] text-slate-400">
            {backendStatus === "connected"
              ? "Engine ready"
              : backendStatus === "checking"
                ? "Checking..."
                : "Engine offline"}
          </span>
        </div>

        <button
          onClick={onHowItWorks}
          className="flex items-center gap-2 rounded-lg border border-[#232a42] bg-[#111522] px-3 py-2 text-xs text-slate-300 transition hover:bg-[#161b2c] hover:text-white"
        >
          <Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">How it works</span>
        </button>
      </div>
    </header>
  );
}

export default Header;