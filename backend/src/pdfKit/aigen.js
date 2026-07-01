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

  const test = Array.from({ length: 75 }, (_, i) => ({
    ID: "6501" + i,
    Prefix: "นาย",
    // FirstName: "OOOOOOOOOOOOOOOOOO",
    // LastName: "OOOOOOOOOOOOOO",
    FirstName: "นายสิริประภัสสรวรรณรัตน์",
    LastName: " พิชญ์พงศ์สิริโชติ",
  }));

  const PAGE_BOTTOM = 730;
  const SEAT_NO = 100;
  const APPLICANT_NUMBER = 220;
  const PREFIX = 300;
  const FIRST_NAME = 300;
  const LAST_NAME = 470;

  // layout config
  const pw = doc.page.width;
  const ph = doc.page.height;
  const mid = doc.page.width / 2;

  function s(x) {
    return doc.widthOfString(x) / 2;
  }
  doc
    .moveTo(pw / 2, 0)
    .lineTo(pw / 2, ph)
    .stroke();
  doc.text("O", mid - wos("O"), 0);
  doc.addPage();
  function Line() {
    doc.strokeColor("red").lineWidth(0.1);
    doc.moveTo(SEAT_NO, 0).lineTo(SEAT_NO, doc.page.height).stroke();
    doc
      .moveTo(APPLICANT_NUMBER, 0)
      .lineTo(APPLICANT_NUMBER, doc.page.height)
      .stroke();
    doc.moveTo(PREFIX, 0).lineTo(PREFIX, doc.page.height).stroke();
    doc.moveTo(LAST_NAME, 0).lineTo(LAST_NAME, doc.page.height).stroke();
    doc
      .moveTo((PREFIX + LAST_NAME) / 2, 0)
      .lineTo((PREFIX + LAST_NAME) / 2, doc.page.height)
      .stroke();
  }
  Line();
  function wos(x) {
    String(x);
    return doc.widthOfString(x) / 2;
  }
  function center(x) {
    return mid - wos(x);
  }
  doc.strokeColor("black");
  const drawHeader = () => {
    const y = 30;
    doc.font(FONT_BOLD);
    doc.fontSize(16);
    const md = 0.4;
    const roomText = "ห้องสอบที่ ";
    const roomNumber_Data = "31";
    const roomLine = roomText + roomNumber_Data;
    doc.text(roomLine, center(roomLine), y);

    doc.moveDown(1);
    doc.font(FONT_REGULAR);
    doc.fontSize(10);

    const examText = "การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ";
    doc.text(examText, center(examText), y + 45);

    const posionText = "ตำแหน่ง ";
    const posionName_Data = "เจ้าพนักงานตรวจสอบทรัพย์สินปฏิบัติการ";
    const AppIDtext_Data = "เลขประจำตัวสอบ ";
    const startAppId_Data = "100001";
    const endAppId_Data = "100030";
    const postionline =
      posionText +
      posionName_Data +
      " " +
      AppIDtext_Data +
      startAppId_Data +
      " ถึง " +
      endAppId_Data;
    doc.text(postionline, center(postionline), y + 45 + 20);
    const dateText = "สอบวัน ";
    const date_Data = "อาทิตย์ที่ 22 มีนาคม 2569";
    const timeText = "เวลา ";
    const time_Data = "09:00 - 12:00 น.";
    const dateline = dateText + date_Data + " " + timeText + time_Data;
    doc.text(dateline, center(dateline), y + 45 + 20 + 20);

    const placeText = "สถานที่สอบ ";
    const place_Data = "มหาวิทยาลัยสวนดุสิต";
    const buildindText = "ตึก/อาคาร ";
    const building_Data = "10";
    const floorText = "ชั้น ";
    const floor_Data = "4";
    const roomText2 = "ห้อง ";
    const room_Data2 = "10406";
    const placeline =
      placeText +
      place_Data +
      " " +
      buildindText +
      building_Data +
      " " +
      floorText +
      floor_Data +
      " " +
      roomText2 +
      room_Data2;

    doc.text(placeline, center(placeline), y + 45 + 20 + 20 + 20);
  };

  const drawTableHeader = (y) => {
    doc.fontSize(10);
    doc.font(FONT_BOLD);

    doc.moveTo(40, y).lineWidth(0.1).lineTo(555, y).stroke();

    doc.text("ลำดับที่นั่งสอบ", SEAT_NO - wos("ลำดับที่นั่งสอบ"), y + 10);
    doc.text(
      "เลขประจำตัวสอบ",
      APPLICANT_NUMBER - wos("เลขประจำตัวสอบ"),
      y + 10,
    );
    doc.text(
      "ชื่อ-นามสกุล",
      (PREFIX + LAST_NAME) / 2 - wos("ชื่อ-นามสกุล"),
      y + 10,
    );

    return y + 40;
  };

  drawHeader();

  let y = drawTableHeader(160);

  doc.fontSize(10);

  test.forEach((t, index) => {
    doc.font(FONT_LIGHT);
    if (index % 25 === 0 && index !== 0) {
      doc.addPage();
      drawHeader();

      y = drawTableHeader(160);

      doc.font(FONT_LIGHT);
    }
    const seatNo = String(index + 1);
    doc.text(seatNo, SEAT_NO - wos(seatNo), y);
    doc.text(t.ID, APPLICANT_NUMBER - wos(t.ID), y);
    doc.text(t.Prefix, PREFIX, y, { continued: true });
    doc.text(t.FirstName, FIRST_NAME, y, { continued: false, width: 150 });
    doc.text(t.LastName, LAST_NAME, y);

    y += 22;
  });

  applicant.forEach((a, index) => {
    doc.font(FONT_LIGHT);
    if (y > PAGE_BOTTOM) {
      doc.addPage();
      drawHeader();

      y = drawTableHeader(160);

      doc.font(FONT_LIGHT);
    }
    doc.text(index + 1, SEAT_NO, y);
    doc.text(a.ApplicantNumber, APPLICANT_NUMBER, y);
    doc.text(a.Prefix, PREFIX, y, { continued: true });
    doc.text(a.FirstName, FIRST_NAME, y, { continued: false });
    doc.text(a.LastName, LAST_NAME, y);

    y += 22;
  });

  doc.end();
};
