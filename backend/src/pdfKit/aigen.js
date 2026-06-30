import PDFDocument from "pdfkit";
import fs from "fs";
import { findAll } from "../models/applicant.model.js";

export const pdfFile = async () => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 30,
  });

  doc.pipe(fs.createWriteStream("./src/pdfKit/aigen.pdf"));

  const FONT_LIGHT = "./src/fonts/Sarabun-Light.ttf";
  const FONT_REGULAR = "./src/fonts/Sarabun-Regular.ttf";
  const FONT_BOLD = "./src/fonts/Sarabun-SemiBold.ttf";
  const applicant = await findAll();

  const test = Array.from({ length: 30 }, (_, i) => ({
    ID: "6501" + i,
    Prefix: "นาย",
    FirstName: "ทรงศักดิ์ก่อเกื้อบุญมากมีลาภบุญมีมีบุญควรหา",
    LastName: "สุวรรณโตกโลกธาตุฌาณวิญญาณ",
  }));

  const PAGE_BOTTOM = 740;
  const SEAT_NO = 100;
  const APPLICANT_NUMBER = 220;
  const PREFIX = 300;
  const FIRST_NAME = 300;
  const LAST_NAME = 470;

  const pw = doc.page.width;
  const ph = doc.page.height;
  const mid = doc.page.width / 2;
  function wof(x) {
    return doc.widthOfString(x) / 2;
  }
  doc
    .moveTo(pw / 2, 0)
    .lineTo(pw / 2, ph)
    .stroke();
  doc.text("O", mid - wof("O"), 0);
  doc.addPage();
  function Line() {
    doc
      .moveTo(SEAT_NO, 0)
      .lineTo(SEAT_NO, doc.page.height)
      .strokeColor("red")
      .stroke();
    doc
      .moveTo(APPLICANT_NUMBER, 0)
      .lineTo(APPLICANT_NUMBER, doc.page.height)
      .strokeColor("red")
      .stroke();
    doc
      .moveTo(PREFIX, 0)
      .lineTo(PREFIX, doc.page.height)
      .strokeColor("red")
      .stroke();
    doc
      .moveTo(FIRST_NAME, 0)
      .lineTo(FIRST_NAME, doc.page.height)
      .strokeColor("red")
      .stroke();
    doc
      .moveTo(LAST_NAME, 0)
      .lineTo(LAST_NAME, doc.page.height)
      .strokeColor("red")
      .stroke();
  }
  Line();
  doc.strokeColor("black");
  const drawHeader = () => {
    doc.font(FONT_BOLD);
    doc.fontSize(16);
    const md = 0.4;
    doc.text("ห้องสอบที่ 31", {
      align: "center",
    });

    doc.moveDown(1);
    doc.font(FONT_REGULAR);
    doc.fontSize(11);

    doc
      .text("การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ", {
        align: "center",
      })
      .moveDown(md);
    doc
      .text(
        "ตำแหน่ง เจ้าพนักงานตรวจสอบทรัพย์สินปฏิบัติการ เลขประจำตัวสอบ 100001 ถึง 100030",
        {
          align: "center",
        },
      )
      .moveDown(md);

    doc
      .text("สอบวันอาทิตย์ที่ 22 มีนาคม 2569 เวลา 09:00 - 12:00 น.", {
        align: "center",
      })
      .moveDown(md);

    const y = doc.y;

    const text1 = "สถานที่สอบ มหาวิทยาลัยสวนดุสิต ";
    const text2 = "ตึก/อาคาร 10 ชั้น 4 ห้อง 10406";

    const totalWidth = doc.widthOfString(text1) + doc.widthOfString(text2);

    const pageWidth = doc.page.width;

    const startX = (pageWidth - totalWidth) / 2;

    doc.text(text1, startX, y);
    doc.text(text2, startX + doc.widthOfString(text1), y, {
      underline: true,
    });

    doc.y = y + 20;
  };

  const drawTableHeader = (y) => {
    doc.fontSize(10);
    doc.font(FONT_BOLD);

    doc.moveTo(40, y).lineWidth(0.1).lineTo(555, y).stroke();

    doc.text("ลำดับที่นั่งสอบ", SEAT_NO - wof("ลำดับที่นั่งสอบ"), y + 8);
    doc.text("เลขประจำตัวสอบ", APPLICANT_NUMBER - wof("เลขประจำตัวสอบ"), y + 8);
    doc.text("ชื่อ-นามสกุล", 360, y + 8);

    return y + 40;
  };

  drawHeader();

  let y = drawTableHeader(160);

  doc.fontSize(10);
  test.forEach((t, index) => {
    doc.font(FONT_LIGHT);
    if (y > PAGE_BOTTOM) {
      doc.addPage();
      drawHeader();

      y = drawTableHeader(160);

      doc.font(FONT_LIGHT);
    }
    const seatNo = String(index + 1);
    doc.text(seatNo, SEAT_NO - wof(seatNo), y);
    doc.text(t.ID, APPLICANT_NUMBER - wof(t.ID), y);
    doc.text(t.Prefix, PREFIX, y, { continued: true });
    doc.text(t.FirstName, FIRST_NAME, y, { continued: false });
    doc.text(t.LastName, LAST_NAME, y);

    y += 22;
  });
  // applicant.forEach((a, index) => {
  //   doc.font(FONT_LIGHT);
  //   if (y > PAGE_BOTTOM) {
  //     doc.addPage();
  //     drawHeader();

  //     y = drawTableHeader(160);

  //     doc.font(FONT_LIGHT);
  //   }
  //   doc.text(index + 1, SEAT_NO, y);
  //   doc.text(a.ApplicantNumber, APPLICANT_NUMBER, y);
  //   doc.text(a.Prefix, PREFIX, y, { continued: true });
  //   doc.text(a.FirstName, FIRST_NAME, y, { continued: false });
  //   doc.text(a.LastName, LAST_NAME, y);

  //   y += 22;
  // });

  doc.end();
};
