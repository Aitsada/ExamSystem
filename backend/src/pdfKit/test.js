// create a document and pipe to a blob
import PDFDocument from "pdfkit";
import fs from "fs";

export const pdfFileTest = () => {
  const doc = new PDFDocument();
  const output = "./src/pdfKit/file.pdf";
  doc.font("./src/fonts/Sarabun-SemiBold.ttf");
  doc.font("./src/fonts/Sarabun-Regular.ttf");
  doc.pipe(fs.createWriteStream(output));

  doc.text("หัวข้อ");
  doc.moveDown(0.5);
  doc.text("รายละเอียดยาวๆ...");
  doc.moveDown();
  doc.text("สรุป");
  doc.lineWidth(5).moveTo(50, 50).lineTo(500, 500).strokeColor("red").stroke()
  doc.lineWidth(5).moveTo(50, 500).lineTo(500, 50).stroke()
  doc.text("สรุป");

  doc.end();
};
