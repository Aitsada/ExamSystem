import PDFDocument from "pdfkit";
import fs from "fs";
import { findAll } from "../models/applicant.model.js";

export const listOfName = async (data) => {
  const {
    roomID,
    roomNo,
    positionID,
    positionName,
    appStart,
    appEnd,
    dateTime,
    facilityName,
    buildingName,
    floorName,
    roomName,
  } = data;

  const app = [].concat(data.applicants || []).filter((a) => a);
  const applicants = []
    .concat(data.applicantNumbers || data["applicantNumbers[]"] || [])
    .filter((applicantNumber) => applicantNumber);
  const doc = new PDFDocument({
    size: "A4",
    margin: 30,
  });

  doc.pipe(fs.createWriteStream("./src/pdfKit/listOfName.pdf"));

  const FONT_LIGHT = "./src/fonts/Sarabun-Light.ttf";
  const FONT_REGULAR = "./src/fonts/Sarabun-Regular.ttf";
  const FONT_BOLD = "./src/fonts/Sarabun-SemiBold.ttf";
  const applicant = await findAll();
  const PAGE_BOTTOM = 730;
  const SEAT_NO = 100;
  const APPLICANT_NUMBER = 220;
  const PREFIX = 320;
  const FIRST_NAME = 320;
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
    const roomNumber_Data = roomNo;
    const roomLine = "ห้องสอบที่ " + roomNumber_Data;
    doc.text(roomLine, center(roomLine), y);

    doc.font(FONT_REGULAR);
    doc.fontSize(10);

    const examText = "การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ";
    doc.text(examText, center(examText), y + 45);

    const posionName_Data = positionName;
    const startAppId_Data = appStart;
    const endAppId_Data = appEnd;
    const postionline =
      "ตำแหน่ง " +
      posionName_Data +
      " " +
      "เลขประจำตัวสอบ " +
      startAppId_Data +
      " ถึง " +
      endAppId_Data;
    doc.text(postionline, center(postionline), y + 45 + 20);
    const time_Data = dateTime;
    doc.text(time_Data, center(time_Data), y + 45 + 20 + 20);

    const place_Data = facilityName;
    const building_Data = buildingName;
    const floor_Data = floorName;
    const room_Data2 = roomName;
    const placeline =
      "สถานที่สอบ " +
      place_Data +
      " " +
      " ตึก/" +
      building_Data +
      " " +
      "ชั้น " +
      floor_Data +
      " " +
      "ห้อง " +
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

  app.forEach((a, index) => {
    doc.font(FONT_LIGHT);
    if (y > PAGE_BOTTOM) {
      doc.addPage();
      drawHeader();

      y = drawTableHeader(160);

      doc.font(FONT_LIGHT);
    }
    const seatNumber = String(index + 1);
    doc.text(seatNumber, SEAT_NO - wos(seatNumber), y);
    const appNumber = a.ApplicantNumber;
    doc.text(appNumber, APPLICANT_NUMBER - wos(appNumber), y);
    doc.text(a.Prefix, PREFIX, y, { continued: true });
    doc.text(a.FirstName, FIRST_NAME, y, { continued: false });
    doc.text(a.LastName, LAST_NAME, y);

    y += 22;
  });
  doc.end();
};
