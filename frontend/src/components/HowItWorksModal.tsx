import {
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  GitCompareArrows,
  X,
} from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: FileSearch,
    title: "Retrieve",
    description:
      "Your question is converted into an embedding and matched against the indexed policy chunks using FAISS.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare",
    description:
      "The strongest retrieved passages are assembled as evidence while preserving their source and section metadata.",
  },
  {
    icon: BrainCircuit,
    title: "Reason",
    description:
      "The reasoning model evaluates whether the supplied evidence answers the question, leaves it uncovered, or contains a conflict.",
  },
  {
    icon: CheckCircle2,
    title: "Cite",
    description:
      "The final decision is returned together with the evidence passages used to reach it.",
  },
];

function HowItWorksModal({
  isOpen,
  onClose,
}: HowItWorksModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#343e60] bg-[#0e111a] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#232a42] px-6 py-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
              Architecture
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              How RuleGuard works
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-[#161b2c] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-px bg-[#232a42] sm:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="bg-[#0e111a] p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-slate-600">
                      0{index + 1}
                    </span>

                    <h3 className="text-sm font-semibold text-slate-200">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[#232a42] px-6 py-4">
          <p className="text-[10px] leading-5 text-slate-600">
            RuleGuard is designed to prefer transparent evidence over
            unsupported answers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksModal;