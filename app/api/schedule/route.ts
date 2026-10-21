import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  UserSchedule,
  userScheduleSUpdatechema,
} from "@/lib/types/schedule-types";
import { endOfWeek, startOfWeek } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  try {
    const rawUserSchedules = await prisma.user.findMany({
      include: {
        shiftSchedules: {
          include: {
            shiftType: true,
          },
          where: {
            date: {
              gte: new Date(
                searchParams.get("startDate") ||
                  startOfWeek(new Date(), { weekStartsOn: 1 }),
              ),
              lte: new Date(
                searchParams.get("endDate") ||
                  endOfWeek(new Date(), { weekStartsOn: 1 }),
              ),
            },
          },
        },
      },
      where: {
        isScheduled: true,
      },
      orderBy: { name: "asc" },
    });

    const shiftSchedule: UserSchedule[] = rawUserSchedules.map((user) => ({
      id: user.id,
      name: user.name,
      department: user.department,
      jobTitle: user.jobTitle,
      shiftSchedules: user.shiftSchedules.map((schedule) => ({
        id: schedule.id,
        userId: schedule.userId,
        shiftTypeId: schedule.shiftTypeId,
        date: schedule.date,
        shiftType: {
          id: schedule.shiftType.id,
          name: schedule.shiftType.name,
          startTime: schedule.shiftType.startTime,
          endTime: schedule.shiftType.endTime,
          color: schedule.shiftType.color,
        },
      })),
    }));
    return NextResponse.json(shiftSchedule);
  } catch (error) {
    console.error("Error fetching shift schedules:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data schedules" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const parsed = userScheduleSUpdatechema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { userId, date, shiftTypeId } = parsed.data;

  try {
    const updatedSchedule = await prisma.shiftSchedule.upsert({
      where: {
        // Menggunakan compound unique index di Prisma Schema (contoh: @@unique([userId, date]))
        userId_date: {
          userId,
          date, // Pastikan format tanggal berupa Date object jika di Prisma bertipe DateTime
        },
      },
      update: {
        shiftTypeId,
      },
      create: {
        userId,
        date,
        shiftTypeId,
      },
    });
    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Error fetching shift schedules:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data schedules" },
      { status: 500 },
    );
  }
}
