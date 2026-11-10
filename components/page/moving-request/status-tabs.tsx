import { MovingStatus, MovingStatusSchema } from "@/lib/types/moving-types";
import { cn } from "@/lib/utils";
import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STATUS_ICON: Record<MovingStatus, { icon: LucideIcon; color: string }> = {
  PENDING: {
    icon: Clock,
    color: "text-amber-500",
  },
  SENT: {
    icon: Truck,
    color: "text-blue-500",
  },
  RECEIVED: {
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  CANCELLED: {
    icon: XCircle,
    color: "text-red-500",
  },
};

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
      className="sticky top-0.5 z-10 mb-3 flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1.5 shadow-sm backdrop-blur-sm"
    >
      {MovingStatusSchema.options.map((status) => {
        const meta = statusMeta[status];
        const isActive = status === active;
        const Icon = STATUS_ICON[status];

        return (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={`${meta.label} - ${meta.hint}`}
            aria-label={meta.label}
            onClick={() => onChange(status)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition sm:px-3",
              isActive
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
            )}
          >
            <Icon.icon className={cn("size-4 shrink-0", Icon.color)} />

            <span className="hidden truncate sm:inline">{meta.label}</span>

            <span
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                meta.badge,
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
