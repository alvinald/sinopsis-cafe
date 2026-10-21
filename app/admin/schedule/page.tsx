"use client";

import { useEffect, useState } from "react";
import {
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { UserSchedule } from "@/lib/types/schedule-types";
import ShiftSelectDialog from "@/components/page/shift/shift-select-dialog";
import { useRouter } from "next/navigation";

type selectedSchedule = {
  userId: string;
  name: string;
  date: Date;
  currentShiftId?: number;
};

export default function ShiftSchedulePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [userSchedules, setUserSchedules] = useState<UserSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] =
    useState<selectedSchedule | null>();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [updatedData, setUpdatedData] = useState<boolean>(true);

  // Rentang hari dalam 1 minggu berjalan (Senin - Minggu)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const SHIFT_STYLE_MAP: Record<string, string> = {
    GRAY: "bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200",
    BLUE: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
    YELLOW:
      "bg-yellow-100 text-yellow-700 border-yellow-500 hover:bg-yellow-200",
    ORANGE:
      "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200",
    PURPLE:
      "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200",
  };

  useEffect(() => {
    // Fetch data jadwal shift dari API
    const fetchUserSchedules = async () => {
      try {
        const startDate = format(
          startOfWeek(currentDate, { weekStartsOn: 1 }),
          "yyyy-MM-dd",
        );
        const endDate = format(
          endOfWeek(currentDate, { weekStartsOn: 1 }),
          "yyyy-MM-dd",
        );

        const response = await fetch(
          `/api/schedule?startDate=${startDate}&endDate=${endDate}`,
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil data jadwal shift");
        }
        const data: UserSchedule[] = await response.json();
        setUserSchedules(data);
        setUpdatedData(false);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setUpdatedData(false);
      }
    };

    fetchUserSchedules();
  }, [currentDate, updatedData]);

  // Navigasi Minggu
  const handlePrevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  // State untuk Pencarian dan Kategori Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Karyawan Berdasarkan Kategori yang Dipilih
  const filteredUserSchedules = userSchedules.filter((userSchedule) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;

    return (
      userSchedule.name.toLowerCase().includes(query) ||
      userSchedule.department?.toLowerCase().includes(query) ||
      userSchedule.jobTitle?.toLowerCase().includes(query)
    );
  });

  // Mendapatkan shift user pada tanggal tertentu
  const getShiftForUserAndDate = (userId: string, date: Date) => {
    // 1. Cari user berdasarkan userId
    const user = filteredUserSchedules.find((u) => u.id === userId);
    if (!user) return null;

    // 2. Cari jadwal spesifik berdasarkan tanggal di dalam shiftSchedules user tersebut
    const schedule = user.shiftSchedules.find((s) =>
      isSameDay(new Date(s.date), date),
    );

    // 3. Kembalikan objek shiftType (atau null jika tidak ada jadwal)
    return schedule?.shiftType ?? null;
  };

  const handleUpdateShift = async (
    userId: string,
    date: Date,
    newShift: number,
  ) => {
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        date: format(date, "yyyy-MM-dd"),
        shiftTypeId: newShift,
      }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(json?.error || "Gagal membuat user");
      return;
    }
    setSelectedSchedule(null);
    setUpdatedData(true);
    return;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Navigasi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Jadwal Shift Kerja {selectedSchedule?.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-gray-100 rounded-l-lg border-r text-gray-600"
              title="Minggu Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-gray-700 border-r">
              {format(weekStart, "dd MMM")} - {format(weekEnd, "dd MMM yyyy")}
            </span>
            <button
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-gray-100 rounded-r-lg text-gray-600"
              title="Minggu Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Field Input Text */}
      <div className=" relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama atau departemen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Tabel Jadwal Shift (Matriks Karyawan x Tanggal) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-700 w-auto whitespace-nowrap sticky left-0 z-20 bg-gray-50 border-r border-gray-200">
                Karyawan
              </th>
              {daysInWeek.map((day) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <th
                    key={day.toISOString()}
                    className={`p-3 text-center border-l border-gray-200 ${
                      isToday ? "bg-blue-50/70" : ""
                    }`}
                  >
                    <div className="text-xs uppercase text-gray-500 font-medium">
                      {format(day, "EEEE", { locale: id })}
                    </div>
                    <div
                      className={`text-sm font-bold mt-0.5 ${
                        isToday ? "text-blue-600" : "text-gray-800"
                      }`}
                    >
                      {format(day, "dd MMM")}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredUserSchedules.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition">
                {/* Kolom Informasi User */}
                <td className="p-4 whitespace-nowrap sticky left-0 z-10 bg-white border-r border-gray-200">
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">
                    {user.jobTitle} {" • "}
                    <span className="font-medium text-gray-700">
                      {user.department}
                    </span>
                  </div>
                </td>

                {/* Kolom Shift per Hari */}
                {daysInWeek.map((day) => {
                  const shift = getShiftForUserAndDate(user.id, day);
                  const isToday = isSameDay(day, new Date());
                  const activeStyle =
                    shift?.color && SHIFT_STYLE_MAP[shift?.color]
                      ? SHIFT_STYLE_MAP[shift?.color]
                      : SHIFT_STYLE_MAP.GRAY;
                  return (
                    <td
                      key={day.toISOString()}
                      className={`p-2 text-center border-l border-gray-200 align-middle ${
                        isToday ? "bg-blue-50/30" : ""
                      }`}
                    >
                      {shift ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSchedule({
                              userId: user.id,
                              name: user.name,
                              date: day,
                              currentShiftId: shift.id,
                            });
                          }}
                          className={`p-2 w-full rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-0.5 ${activeStyle}`}
                        >
                          <span>{shift.name}</span>
                          <span className="text-[10px] opacity-80">
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSchedule({
                              userId: user.id,
                              name: user.name,
                              date: day,
                            })
                          }
                          className="w-full h-12 rounded-lg border border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition group"
                          title="Tambah Shift"
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* MODAL DIALOG SHADCN UI */}
      <ShiftSelectDialog
        isOpen={!!selectedSchedule}
        name={selectedSchedule?.name}
        date={selectedSchedule?.date}
        currentShiftId={selectedSchedule?.currentShiftId}
        shiftStyleMap={SHIFT_STYLE_MAP}
        onClose={() => setSelectedSchedule(null)}
        onSelectShift={(newShift) => {
          if (selectedSchedule) {
            handleUpdateShift(
              selectedSchedule.userId,
              selectedSchedule.date,
              newShift,
            );
          }
        }}
      />
    </div>
  );
}
