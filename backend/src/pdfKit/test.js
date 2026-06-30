// create a document and pipe to a blob
import PDFDocument from "pdfkit";
import fs from "fs";
import { findAll } from "../models/applicant.model.js";

export const pdfFileTest = async () => {
  const doc = new PDFDocument({ size: "A4" });

  const output = "./src/pdfKit/file.pdf";
  doc.font("./src/fonts/Sarabun-SemiBold.ttf");
  doc.font("./src/fonts/Sarabun-Regular.ttf");
  doc.pipe(fs.createWriteStream(output));

  doc.fontSize(16);
  const mid = doc.page.width / 2;
  doc.moveTo(mid, 0).lineTo(mid, 841).stroke();
  const text = "TOT";
  doc.text(text, mid - doc.widthOfString(text) / 2, 0);
  doc.fontSize(12);
  let y = 50;
  doc.addPage();

  const applicantsModel = await findAll();

  applicantsModel.forEach((a, index) => {
    if (y > 740) {
      doc.addPage();
      y = 50;
    }
    doc.text(index, 50, y);
    doc.text(a.ApplicantNumber, 100, y);
    doc.text(a.Prefix, 250, y, { continued: true });
    doc.text(a.FirstName, 250, y, { continued: false });
    doc.text(a.LastName, 400, y);

    y += 20;
  });

  doc.end();
};
