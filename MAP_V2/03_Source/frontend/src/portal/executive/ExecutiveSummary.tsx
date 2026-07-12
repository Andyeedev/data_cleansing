interface ExecutiveSummaryProps {
  programme: string;
  phase: string;
  status: string;
  completion: number;
  confidence: number;
  lastExecution: string;
}

export const ExecutiveSummary = ({
  programme,
  phase,
  status,
  completion,
  confidence,
  lastExecution,
}: ExecutiveSummaryProps) => {
  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{programme}</h1>
          <p className="text-primary-100 text-sm">
            Phase: {phase} | Status: {status} | Last Execution: {lastExecution}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{completion}%</div>
            <div className="text-xs text-primary-100">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{confidence}%</div>
            <div className="text-xs text-primary-100">Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};
