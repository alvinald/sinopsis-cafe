import { Button } from "@/components/ui/button";
import { Moving, MovingStatus } from "@/lib/types/moving-types";
import { cn } from "@/lib/utils";
import { CheckCheck, Send, X } from "lucide-react";

export default function CardAction({
  moving,
  onMove,
}: {
  moving: Moving;
  onMove: (id: string, status: MovingStatus) => void;
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
  if (moving.status === "PENDING" || moving.status === "SENT") {
    return (
      <Button
        type="button"
        size="xs"
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={(e) => {
          e.stopPropagation();
          if (moving.status === "PENDING") {
            onMove(moving.id, "SENT");
          } else if (moving.status === "SENT") {
            onMove(moving.id, "RECEIVED");
          }
        }}
      >
        <Send className="size-3.5" />

        {getButtonLabel(moving.status)}
      </Button>
    );
  }

  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-2xl px-2 py-0.5 text-[11px] font-semibold",
        {
          "bg-green-100 text-green-800": moving.status === "RECEIVED",
          "bg-red-100 text-red-800": moving.status === "CANCELLED",
        },
      )}
    >
      {moving.status === "RECEIVED" && <CheckCheck className="size-3.5" />}
      {moving.status === "CANCELLED" && <X className="size-3.5" />}
      {getButtonLabel(moving.status)}
    </span>
  );
}
