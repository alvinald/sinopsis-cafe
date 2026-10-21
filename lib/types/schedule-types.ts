import z from "zod";

export const ShiftTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  color: z.string().nullable(),
});

export const scheduleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  shiftTypeId: z.number(),
  date: z.date(),
  shiftType: ShiftTypeSchema,
});

export const userScheduleSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.string().nullable(),
  jobTitle: z.string().nullable(),
  shiftSchedules: z.array(scheduleSchema).default([]),
});

export const userScheduleSUpdatechema = z.object({
  userId: z.string(),
  date: z.coerce.date(),
  shiftTypeId: z.number(),
});

export type Schedule = z.infer<typeof scheduleSchema>;
export type ShiftType = z.infer<typeof ShiftTypeSchema>;
export type UserSchedule = z.infer<typeof userScheduleSchema>;
export type userScheduleSUpdatechema = z.infer<typeof userScheduleSUpdatechema>;
