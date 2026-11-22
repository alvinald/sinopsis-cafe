import * as XLSX from "xlsx";

type ExcelColumn<T> = {
  header: string;
  key: keyof T;
  width?: number;
};

type ExcelSheet<T> = {
  sheetName: string;
  data: T[];
  columns: ExcelColumn<T>[];
};

type ExportExcelOptions<T> = {
  fileName: string;
  sheets: ExcelSheet<T>[];
};

export function exportToExcel<T extends Record<string, unknown>>({
  fileName,
  sheets,
}: ExportExcelOptions<T>) {
  const workbook = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const rows = sheet.data.map((item) =>
      Object.fromEntries(
        sheet.columns.map((column) => [column.header, item[column.key]]),
      ),
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = sheet.columns.map((column) => ({
      wch: column.width ?? 15,
    }));

    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
  });

  XLSX.writeFile(
    workbook,
    fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
  );
}
