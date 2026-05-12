import xlsx from "xlsx";

export function parseExcelRows(file) {
  if (!file?.buffer) {
    throw new Error("Excel file is required");
  }

  const workbook = xlsx.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return [];
  }

  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });
}

export function getValue(row, keys, defaultValue = "") {
  const keyList = Array.isArray(keys) ? keys : [keys];
  const matchedKey = keyList.find((key) => row[key] !== undefined && row[key] !== null);
  const value = matchedKey ? row[matchedKey] : defaultValue;

  if (typeof value === "string") {
    return value.trim();
  }

  return value ?? defaultValue;
}

export function toNumber(value, defaultValue = 0) {
  if (value === "" || value === null || value === undefined) {
    return defaultValue;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : defaultValue;
}
