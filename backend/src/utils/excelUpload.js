import multer from "multer";

const maxFileSize = 5 * 1024 * 1024;

export const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter(req, file, cb) {
    const fileName = file.originalname.toLowerCase();
    const isExcelFile = fileName.endsWith(".xls") || fileName.endsWith(".xlsx");

    if (!isExcelFile) {
      return cb(new Error("Only .xls and .xlsx files are allowed"));
    }

    return cb(null, true);
  },
});
