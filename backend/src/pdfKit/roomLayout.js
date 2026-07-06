import PDFDocument from "pdfkit";
import fs from "fs";

export const roomLayout = async () => {
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
  const seatLayout_Data = "มหาวิทยาลัยสวนดุสิต";
  const seatLayoutOneLine = seatLayoutText + " " + seatLayout_Data;
  doc.text(seatLayoutOneLine, center(seatLayoutOneLine), y);
  y += 25;

  const dateText = "สอบวัน";
  const date_Data = "อาทิตย์ที่ 22 มีนาคม 2569 เวลา 09:00 - 12:00 น.";
  const dateOneLine = dateText + date_Data;
  doc.text(dateOneLine, center(dateOneLine), y);
  y += 25;

  const roomText = "ห้องสอบ ที่";
  const room_Data = "31 (10406) ชั้น 4 ตึก/อาคาร 10";
  const roomOneLine = roomText + " " + room_Data;
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

  const applicants = 25;
  const column = 6;
  const row = 5;

  let columnX = 150;
  for (let i = 1; i <= column; i++) {
    doc.text(i, ml + columnX - wos(String(i)), y);
    columnX += 105;
  }
  y += 25;

  for (let i = 1; i <= row; i++) {
    doc.text(i, ml + 70 - wos(String(i)), y);
    y += 25;
  }

  doc.font(FONT_BOLD);
  doc.fontSize(11);
  const amountText = "จำนวน";
  const appAmount_Data = String(applicants);
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
  for (let i = 1; i <= applicants; i++) {
    for (let j = i; j <= i; j++) {
      appFrame(a, b);
      doc.text("650" + i, ml + columnX - wos("650" + i), y);
      columnX += 105;
      a += 105;
      if (j % column === 0) {
        columnX = 150;
        y += 25;

        a = 100;
        b += 25;
      }
    }
  }

  doc.end();
};
