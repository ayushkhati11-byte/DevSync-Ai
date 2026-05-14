type TechStackProps = {
  techs: string[];
  limit?: number;
  size?: "sm" | "md";
};

export function TechStack({ techs, limit, size = "sm" }: TechStackProps) {
  if (!techs || techs.length === 0) return null;

  const display = limit ? techs.slice(0, limit) : techs;
  const remaining = limit ? techs.length - limit : 0;

  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <div className="flex flex-wrap gap-1.5">
      {display.map((tech) => (
        <span
          key={tech}
          className={`${sizeClasses} bg-white/[0.04] rounded-md border border-white/[0.08] text-white/60 font-medium`}
        >
          {tech}
        </span>
      ))}
      {remaining > 0 && (
        <span className={`${sizeClasses} bg-white/[0.02] rounded-md text-white/30`}>
          +{remaining}
        </span>
      )}
    </div>
  );
}
