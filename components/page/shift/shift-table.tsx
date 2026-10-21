import { UserSchedule } from "@/lib/types/schedule-types";
import { format, Interval, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

const ShiftTable = ({
  daysInWeek,
  filteredUserSchedules,
}: {
  daysInWeek: Date[];
  filteredUserSchedules: UserSchedule[];
}) => {
  return (
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
  );
};

export default ShiftTable;
