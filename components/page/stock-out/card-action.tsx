import { Button } from "@/components/ui/button";
import { StockOut, StockOutStatus } from "@/lib/types/stock-out-types";
import { cn } from "@/lib/utils";
import { CheckCheck, Send, X } from "lucide-react";

export default function CardAction({
  stockOut,
  canSent,
  onMove,
}: {
  stockOut: StockOut;
  canSent: boolean;
  onMove: (id: string, status: StockOutStatus) => void;
}) {
  const getButtonLabel = (status: string) => {
    if (status === "PENDING") {
      return "Kirim";
    } else if (status === "SENT") {
      return "Terima";
    } else if (status === "RECEIVED") {
      return "Selesai";
    } else if (status === "CANCELLED") {
      return "Dibatalkan";
    }
    return "";
  };
  if ((stockOut.status === "PENDING" && canSent) || stockOut.status === "SENT") {
    return (
      <Button
        type="button"
        size="xs"
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={(e) => {
          e.stopPropagation();
          if (stockOut.status === "PENDING") {
            onMove(stockOut.id, "SENT");
          } else if (stockOut.status === "SENT") {
            onMove(stockOut.id, "RECEIVED");
          }
        }}
      >
        <Send className="size-3.5" />

        {getButtonLabel(stockOut.status)}
      </Button>
    );
  }

  if (stockOut.status === "RECEIVED" || stockOut.status === "CANCELLED") {
    return (
      <span
        className={cn(
          "flex items-center gap-1 rounded-2xl px-2 py-0.5 text-[11px] font-semibold",
          {
            "bg-green-100 text-green-800": stockOut.status === "RECEIVED",
            "bg-red-100 text-red-800": stockOut.status === "CANCELLED",
          },
        )}
      >
        {stockOut.status === "RECEIVED" && <CheckCheck className="size-3.5" />}
        {stockOut.status === "CANCELLED" && <X className="size-3.5" />}
        {getButtonLabel(stockOut.status)}
      </span>
    );
  }
}
