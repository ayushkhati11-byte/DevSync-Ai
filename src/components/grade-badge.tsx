type GradeBadgeProps = {
  score: number;
  size?: "sm" | "md" | "lg";
};

function scoreToGrade(score: number): string {
  if (score >= 93) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 58) return "C+";
  if (score >= 50) return "C";
  if (score >= 40) return "C-";
  if (score >= 30) return "D";
  return "F";
}

const gradeConfig: Record<string, { gradient: string; shadow: string }> = {
  "A+": { gradient: "from-emerald-400 to-emerald-300", shadow: "shadow-emerald-500/20" },
  "A": { gradient: "from-emerald-400 to-cyan-400", shadow: "shadow-emerald-500/20" },
  "A-": { gradient: "from-emerald-400 to-cyan-400", shadow: "shadow-emerald-500/15" },
  "B+": { gradient: "from-cyan-400 to-sky-400", shadow: "shadow-cyan-500/20" },
  "B": { gradient: "from-cyan-400 to-sky-400", shadow: "shadow-cyan-500/20" },
  "B-": { gradient: "from-cyan-400 to-sky-400", shadow: "shadow-cyan-500/15" },
  "C+": { gradient: "from-amber-400 to-yellow-400", shadow: "shadow-amber-500/20" },
  "C": { gradient: "from-amber-400 to-yellow-400", shadow: "shadow-amber-500/20" },
  "C-": { gradient: "from-amber-400 to-yellow-400", shadow: "shadow-amber-500/15" },
  "D": { gradient: "from-orange-400 to-red-400", shadow: "shadow-orange-500/20" },
  "F": { gradient: "from-red-400 to-rose-400", shadow: "shadow-red-500/20" },
};

const sizeMap = { sm: "text-xs px-2 py-0.5", md: "text-sm px-3 py-1", lg: "text-lg px-4 py-1.5" };

export function GradeBadge({ score, size = "md" }: GradeBadgeProps) {
  const grade = scoreToGrade(score);
  const config = gradeConfig[grade];

  return (
    <span
      className={`inline-flex items-center font-black rounded-md bg-gradient-to-br ${config.gradient} text-black ${sizeMap[size]} shadow-lg ${config.shadow}`}
    >
      {grade}
    </span>
  );
}
