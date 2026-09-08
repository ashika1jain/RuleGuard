import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import QueryComposer from "./components/QueryComposer";
import EmptyState from "./components/EmptyState";
import ResultView from "./components/ResultView";
import EvidencePanel from "./components/EvidencePanel";
import HowItWorksModal from "./components/HowItWorksModal";

import {
  askRuleGuard,
  checkBackendConnection,
} from "./services/api";

import type {
  AskResponse,
  BackendConnectionStatus,
  QueryRecord,
} from "./types";

function App() {
  const [currentResponse, setCurrentResponse] =
    useState<AskResponse | null>(null);

  const [recentQueries, setRecentQueries] =
    useState<QueryRecord[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [backendStatus, setBackendStatus] =
    useState<BackendConnectionStatus>("checking");

  const [isHowItWorksOpen, setIsHowItWorksOpen] =
    useState(false);

  const [activeCitationIndex, setActiveCitationIndex] =
    useState<number | null>(null);

  // Used to reset the query input when starting a new query.
  const [queryComposerKey, setQueryComposerKey] =
    useState(0);


  // Check backend automatically when the page loads.
  useEffect(() => {
    checkBackendConnection().then((connected) => {
      setBackendStatus(
        connected ? "connected" : "unreachable"
      );
    });
  }, []);


  // Start a completely new policy query.
  const handleNewQuery = () => {
    setCurrentResponse(null);
    setError(null);
    setActiveCitationIndex(null);
    setIsLoading(false);

    // Remount QueryComposer so its input becomes empty.
    setQueryComposerKey((previous) => previous + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleExecuteQuery = async (question: string) => {
    if (!question.trim() || isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await askRuleGuard(question);

      setCurrentResponse(response);
      setBackendStatus("connected");

      const record: QueryRecord = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        question,
        classification: response.classification,
        response,
      };

      setRecentQueries((previous) => [
        record,
        ...previous.filter(
          (item) => item.question !== question
        ),
      ].slice(0, 8));

    } catch (err) {
      setBackendStatus("unreachable");

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the RuleGuard backend."
      );

    } finally {
      setIsLoading(false);
    }
  };


  const handleCitationClick = (index: number) => {
    setActiveCitationIndex(index);

    requestAnimationFrame(() => {
      const element = document.getElementById(
        `evidence-${index}`
      );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };


  const handleRetry = () => {
    if (currentResponse?.question) {
      handleExecuteQuery(currentResponse.question);
    }
  };


  const handleCheckBackend = async () => {
    setBackendStatus("checking");

    const connected = await checkBackendConnection();

    setBackendStatus(
      connected ? "connected" : "unreachable"
    );
  };


  return (
    <div className="h-screen overflow-hidden bg-[#090a0f] text-slate-100">

      <div className="flex h-full">

        <Sidebar
          recentQueries={recentQueries}
          onSelectQuery={(record) =>
            setCurrentResponse(record.response)
          }
          backendStatus={backendStatus}
          onHowItWorks={() =>
            setIsHowItWorksOpen(true)
          }
          onNewQuery={handleNewQuery}
        />


        <main className="flex min-w-0 flex-1 flex-col">

          <Header
            backendStatus={backendStatus}
            onHowItWorks={() =>
              setIsHowItWorksOpen(true)
            }
          />


          <div className="flex-1 overflow-y-auto">

            <div className="mx-auto w-full max-w-5xl px-6 py-8">

              <QueryComposer
                key={queryComposerKey}
                onSubmit={handleExecuteQuery}
                isLoading={isLoading}
              />


              {error && (
                <div className="mt-5 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">

                  <span>{error}</span>

                  <button
                    onClick={handleRetry}
                    className="ml-4 flex shrink-0 items-center gap-2 rounded-lg bg-rose-500/20 px-3 py-1.5 font-medium transition-colors hover:bg-rose-500/30"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                  </button>

                </div>
              )}


              <div className="mt-8">

                {currentResponse ? (
                  <ResultView
                    response={currentResponse}
                    onCitationClick={handleCitationClick}
                  />
                ) : (
                  <EmptyState
                    onSelectPrompt={handleExecuteQuery}
                  />
                )}

              </div>

            </div>

          </div>


          <footer className="border-t border-[#232a42]/40 py-3 text-center text-[11px] text-slate-500">
            RuleGuard · Evidence-first policy QA
          </footer>

        </main>


        <aside className="hidden h-full w-[480px] shrink-0 overflow-hidden border-l border-[#232a42] lg:block">

          <EvidencePanel
            evidence={currentResponse?.evidence ?? []}
            supportingIndices={
              currentResponse?.supporting_evidence ?? []
            }
            activeCitationIndex={activeCitationIndex}
          />

        </aside>

      </div>


      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() =>
          setIsHowItWorksOpen(false)
        }
      />


      {backendStatus === "unreachable" && (
        <button
          onClick={handleCheckBackend}
          className="fixed bottom-5 right-5 rounded-lg border border-[#232a42] bg-[#0e111a] px-3 py-2 text-xs text-slate-400 shadow-xl transition-colors hover:text-white"
        >
          Check backend
        </button>
      )}

    </div>
  );
}

export default App;