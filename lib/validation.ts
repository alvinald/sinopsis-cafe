import { ZodError } from "zod";

export function validationError(error: ZodError) {
  return {
    success: false,
    message: "Periksa kembali data yang Anda masukkan.",
    errors: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: getValidationMessage(issue),
    })),
  };
}

function getValidationMessage(issue: ZodError["issues"][number]) {
  if (issue.code === "invalid_type") {
    if (issue.input === null) {
      return "Data wajib diisi.";
    }

    if (issue.expected === "string") {
      return "Harus berupa teks.";
    }

    if (issue.expected === "number") {
      return "Harus berupa angka.";
    }

    if (issue.expected === "boolean") {
      return "Pilihan tidak valid.";
    }

    if (issue.expected === "object") {
      return "Format data tidak valid.";
    }

    if (issue.expected === "array") {
      return "Data harus berupa daftar.";
    }
  }

  return issue.message;
}
