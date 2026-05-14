type ScoreRadarProps = {
  overallScore: number;
  codeQuality: number;
  documentation: number;
  bestPractices: number;
  performance: number;
};

const scoreColor = (v: number) => {
  if (v >= 80) return "text-emerald-400";
  if (v >= 60) return "text-cyan-400";
  if (v >= 40) return "text-amber-400";
  return "text-red-400";
};

const barColor = (v: number) => {
  if (v >= 80) return "bg-emerald-400";
  if (v >= 60) return "bg-cyan-400";
  if (v >= 40) return "bg-amber-400";
  return "bg-red-400";
};

export function ScoreRadar({ overallScore, codeQuality, documentation, bestPractices, performance }: ScoreRadarProps) {
  const dims = [
    { label: "Code Quality", value: codeQuality, key: "cq" },
    { label: "Documentation", value: documentation, key: "doc" },
    { label: "Best Practices", value: bestPractices, key: "bp" },
    { label: "Performance", value: performance, key: "perf" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40 uppercase tracking-wider">Overall Score</span>
        <span className={`text-2xl font-black ${scoreColor(overallScore)}`}>{overallScore}</span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor(overallScore)}`} style={{ width: `${overallScore}%` }} />
      </div>
      <div className="space-y-2.5 pt-1">
        {dims.map((d) => (
          <div key={d.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white/60">{d.label}</span>
              <span className={`text-sm font-bold ${scoreColor(d.value)}`}>{d.value}</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${barColor(d.value)}`} style={{ width: `${d.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
