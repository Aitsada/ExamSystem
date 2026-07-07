import PDFDocument from "pdfkit";
import fs from "fs";

export const roomLayout = async (data) => {
  const {
    roomNo,
    roomName,
    floorName,
    buildingName,
    rows,
    columns,
    facilityName,
    dateTime,
  } = data;

  const applicants = []
    .concat(data.applicantNumbers || data["applicantNumbers[]"] || [])
    .filter((applicantNumber) => applicantNumber);
  const applicantCount = applicants.length;
  const columnCount = Number(columns) || 0;
  const rowCount = Number(rows) || 0;

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 30,
  });
  doc.pipe(fs.createWriteStream("./src/pdfKit/roomLayout.pdf"));

  const FONT_LIGHT = "./src/fonts/Sarabun-Light.ttf";
  const FONT_REGULAR = "./src/fonts/Sarabun-Regular.ttf";
  const FONT_BOLD = "./src/fonts/Sarabun-SemiBold.ttf";

  // layout config
  const pw = doc.page.width;
  const ph = doc.page.height;
  const mid = doc.page.width / 2;

  let y = 30;
  function wos(x) {
    return doc.widthOfString(x) / 2;
  }
  function center(x) {
    return mid - wos(x);
  }

  doc.font(FONT_LIGHT);
  const ml = doc.page.margins.left;
  const mr = doc.page.margins.right;

  doc.font(FONT_BOLD);
  doc.fontSize(11);
  const seatLayoutText = "ผังที่นั่งสอบ";
  const seatLayout_Data = facilityName;
  const seatLayoutOneLine = seatLayoutText + " " + seatLayout_Data;
  doc.text(seatLayoutOneLine, center(seatLayoutOneLine), y);
  y += 25;

  const date_Data = dateTime;
  doc.text(date_Data, center(date_Data), y);
  y += 25;
  const room_No = roomNo;
  const floor_Name = floorName;
  const building_Name = buildingName;
  const roomOneLine =
    "ห้องสอบที่ " +
    room_No +
    "(" +
    roomName +
    ")" +
    " ชั้น " +
    floor_Name +
    " ตึก/" +
    building_Name;
  doc.text(roomOneLine, ml + 50, y);
  y += 25;

  const headerText = "หน้าห้องสอบ";
  doc.text(headerText, center(headerText), y);
  y += 25;

  doc.font(FONT_REGULAR);
  doc.fontSize(10);

  const rowText = "แถวที่";
  doc.text(rowText, ml + 70 - wos(rowText), y);

  //   Table

  let columnX = 150;
  for (let i = 1; i <= columnCount; i++) {
    doc.text(i, ml + columnX - wos(String(i)), y);
    columnX += 105;
  }
  y += 25;

  for (let i = 1; i <= rowCount; i++) {
    doc.text(i, ml + 70 - wos(String(i)), y);
    y += 25;
  }

  doc.font(FONT_BOLD);
  doc.fontSize(11);
  const amountText = "จำนวน";
  const appAmount_Data = String(applicantCount);
  const amountOneLine = amountText + " " + appAmount_Data + " " + "คน";
  doc.text(amountOneLine, center(amountOneLine), y);
  function appFrame(x, y) {
    doc
      .lineWidth(0.1)
      .rect(ml + x, y, 100, 15)
      .stroke();
  }
  doc.font(FONT_LIGHT);
  y = 155;
  columnX = 150;
  let a = 100;
  let b = 153;
  applicants.forEach((app, i) => {
    i += 1;
    const applicantNumber = String(app);
    for (let j = i; j <= i; j++) {
      appFrame(a, b);
      doc.text(applicantNumber, ml + columnX - wos(applicantNumber), y);
      columnX += 105;
      a += 105;
      if (j % columnCount === 0 && j > 0) {
        columnX = 150;
        y += 25;

        a = 100;
        b += 25;
      }
    }
  });

  doc.end();
};
