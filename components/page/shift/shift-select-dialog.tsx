import { useEffect, useState } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ShiftType } from "@/lib/types/schedule-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShiftSelectDialogProps {
  isOpen: boolean;
  userId?: string;
  name?: string;
  date?: Date;
  currentShiftId?: number;
  shiftStyleMap: Record<string, string>;
  onClose: () => void;
  onSelectShift: (newShift: number) => void;
}

export default function ShiftSelectDialog({
  isOpen,
  name,
  date,
  currentShiftId,
  shiftStyleMap,
  onClose,
  onSelectShift,
}: ShiftSelectDialogProps) {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(
    currentShiftId ?? null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchShifts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/shiftType");
        const data = await res.json();
        setShiftTypes(data);
      } catch (error) {
        console.error("Gagal mengambil data shift:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setSelectedShiftId(currentShiftId ?? null);
  }, [isOpen, currentShiftId]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Pilih Shift Kerja
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {name && date ? (
              <>
                Atur jadwal untuk{" "}
                <span className="font-semibold text-gray-800">{name}</span> pada
                hari{" "}
                <span className="font-semibold text-gray-800">
                  {format(date, "dddd", { locale: id })}
                </span>
                .
              </>
            ) : (
              "Pilih salah satu jadwal shift di bawah ini."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* LIST PILIHAN SHIFT */}
        <div className="grid grid-cols-1 gap-2 py-3">
          {shiftTypes.map((shiftType: ShiftType) => {
            const isSelected = selectedShiftId === shiftType.id;
            const colorKey = (shiftType?.color as string) || "GRAY";
            const styleClass = shiftStyleMap[colorKey] || shiftStyleMap.GRAY;
            return (
              <button
                key={shiftType.id}
                type="button"
                onClick={() => {
                  setSelectedShiftId(shiftType.id);
                  onSelectShift(shiftType.id);
                }}
                className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all text-left ${styleClass} ${
                  isSelected
                    ? "ring-2 ring-offset-1 ring-blue-600 font-bold"
                    : "hover:opacity-90"
                }`}
              >
                <div>
                  <div className="text-sm font-bold">{shiftType.name}</div>
                  <div className="text-xs opacity-80">
                    {shiftType.startTime} - {shiftType.endTime} WIB
                  </div>
                </div>

                {isSelected && (
                  <span className="text-xs bg-white/80 px-2 py-0.5 rounded-md font-bold shadow-sm">
                    Aktif
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
