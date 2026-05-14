import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-white/20" />
      </div>
      <h3 className="text-base font-semibold text-white/70 mb-1">{title}</h3>
      {description && <p className="text-sm text-white/40 mb-5 text-center max-w-sm">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-all shadow-lg shadow-white/10"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
