import { MovingStatus, MovingStatusSchema } from "@/lib/types/moving-types";
import { cn } from "@/lib/utils";

export default function StatusTabs({
  active,
  counts,
  onChange,
  statusMeta,
}: {
  active: MovingStatus;
  counts: Record<MovingStatus, number>;
  onChange: (status: MovingStatus) => void;
  statusMeta: Record<
    MovingStatus,
    { label: string; hint: string; dot: string; badge: string }
  >;
}) {
  return (
    <div
      role="tablist"
      aria-label="Status moving"
      className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1.5 sticky top-0.5 z-10 mb-3 shadow-sm backdrop-blur-sm"
    >
      {MovingStatusSchema.options.map((status) => {
        const meta = statusMeta[status];
        const isActive = status === active;

        return (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={meta.hint}
            onClick={() => onChange(status)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
            )}
          >
            <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />

            <span className="truncate">{meta.label}</span>

            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                isActive ? "bg-muted text-foreground" : "bg-card/70",
              )}
            >
              {counts[status]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
