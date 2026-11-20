export function can(
  permissions: string[] | undefined | null,
  required: string | string[],
): boolean {
  if (!permissions?.length) return false;
  if (permissions.includes("*")) return true;

  const list = Array.isArray(required) ? required : [required];
  return list.some((req) => permissions.includes(req));
}
