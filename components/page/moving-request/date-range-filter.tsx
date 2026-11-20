import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  onReset,
  className,
}: {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}) {
  const isInvalid = Boolean(from && to && from > to);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-end sm:gap-3">
          <Field className="min-w-0">
            <Input
              id="moving-date-from"
              type="date"
              value={from}
              onChange={(event) => onFromChange(event.target.value)}
              className="h-9 w-full min-w-0 sm:w-40"
            />
          </Field>

          <Field className="min-w-0">
            <Input
              id="moving-date-to"
              type="date"
              value={to}
              onChange={(event) => onToChange(event.target.value)}
              className="h-9 w-full min-w-0 sm:w-40"
            />
          </Field>
        </div>

        {isInvalid && (
          <p className="text-xs text-destructive">
            Tanggal awal harus sebelum tanggal akhir.
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full sm:w-auto"
      >
        <RotateCcw className="size-3.5" />1 Bulan Terakhir
      </Button>
    </div>
  );
}
