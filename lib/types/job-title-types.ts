import { z } from "zod";
import { DepartmentSchema } from "./department-types";

export const JobTitleSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.string(),
});

export const JobTitleWithDeptSchema = JobTitleSchema.extend({
  departement: DepartmentSchema.nullable(),
});

export type JobTitle = z.infer<typeof JobTitleSchema>;
export type JobTitleWithDept = z.infer<typeof JobTitleWithDeptSchema>;
