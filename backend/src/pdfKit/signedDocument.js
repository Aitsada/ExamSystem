import PDFDocument from "pdfkit";
import fs from "fs";

export const signedDocument = () => {
  const doc = new PDFDocument({
    size: "A4",
    margins: 20,
  });

  doc.pipe(fs.createWriteStream("./src/pdfKit/signedDocument.pdf"));
  const FONT_LIGHT = "./src/fonts/Sarabun-Light.ttf";
  const FONT_REGULAR = "./src/fonts/Sarabun-Regular.ttf";
  const FONT_BOLD = "./src/fonts/Sarabun-SemiBold.ttf";

  // layout config
  const pw = doc.page.width;
  const ph = doc.page.height;
  const mid = doc.page.width / 2;

  function wos(x) {
    String(x);
    return doc.widthOfString(x) / 2;
  }
  function center(x) {
    return mid - wos(x);
  }

  doc.font(FONT_LIGHT);

  //   header

  const drawHeader = () => {
    let y = 30;
    doc.fontSize(14);
    doc.font(FONT_BOLD);

    const title = "ใบเซ็นชื่อผู้เข้าสอบ";
    doc.text(title, center(title), y);

    doc.fontSize(10);
    y += 23;
    const positionText = "ตำแหน่ง ";
    doc.text(positionText, 20, y);

    y += 23;
    const dateText = "สอบวัน ";
    doc.text(dateText, 20, y);

    y += 23;
    const placeText = "สถานที่สอบ ";
    doc.text(placeText, 20, y);

    y += 23;
    const examRoomLeaderText = "ชื่อหัวหน้าห้องสอบ";
    const examSupervisorText = "ชื่อเจ้าหน้าที่คุมสอบ";
    const examSupervisorLine =
      examRoomLeaderText +
      "......................................................................." +
      examSupervisorText +
      ".......................................................................";
    doc.text(examSupervisorLine, 20, y);

    y += 23;
    const examAmountText = "จำนวนผู้เข้าสอบ";
    const examAbsentText = "จำนวนผู้ขาดสอบ";
    const examLine =
      examAmountText +
      "..............." +
      "คน " +
      examAbsentText +
      "..............." +
      "คน ";
    doc.text(examLine, 20, y);

    y += 25;
    doc
      .lineWidth(0.1)
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();

    const guidelinesText = "ข้อปฏิบัติ";
    const guidelinesText_1 = "ห้ามผู้มาสายเข้าห้องสอบหลังจาก เวลา 09.30 น.";
    const guidelinesText_2 =
      "ให้ผู้เข้าสอบเขียนชื่อ – นามสกุล (ตัวบรรจง) ลงในช่องลายมือชื่อ (ตัวบรรจง) เวลา 09.30 น.";
    const guidelinesText_3 =
      "เจ้าหน้าที่คุมสอบตรวจสอบใบหน้าและเลขประจําตัวประชาชนในบัตรประจําตัวสอบกับบัตรประจําตัวประชาชนให้ตรงกัน";
    const guidelinesText_4 =
      "เจ้าหน้าที่คุมสอบเขียน –ขส- ลงในช่องลายมือชื่อ (ตัวบรรจง) ของผู้ขาดสอบ";
    const guidelinesText_5 =
      "เจ้าหน้าที่คุมสอบเซ็นชื่อรับรองการตรวจสอบไว้ท้ายใบเซ็นชื่อ";

    y += 10;
    doc.text(guidelinesText, 20, y);
    doc.font(FONT_LIGHT);

    doc.text("1. ", 75, y, { continued: true });
    doc.text(guidelinesText_1, 75, y);
    y += 20;
    doc.text("2. ", 75, y, { continued: true });
    doc.text(guidelinesText_2, 75, y);
    y += 20;
    doc.text("3. ", 75, y, { continued: true });
    doc.text(guidelinesText_3, 75, y);
    y += 20;
    doc.text("4. ", 75, y, { continued: true });
    doc.text(guidelinesText_4, 75, y);
    y += 20;
    doc.text("5. ", 75, y, { continued: true });
    doc.text(guidelinesText_5, 75, y);
  };

  const applicantData = Array.from({ length: 30 }, (_, i) => ({
    no: i + 1,
    appID: "10001",
    customerID: "1219800371284",
    prefix: "นาย",
    firstName: "อิษฎา",
    lastName: "สุวรรณโต",
  }));
  const drawTable = (y) => {
    doc.lineWidth(0.1);

    const w = pw - 40;
    const h = 490;
    doc.rect(20, y, pw - 40, h).stroke();
    // Y
    doc
      .moveTo(50, y)
      .lineTo(50, y + h)
      .stroke();
    doc
      .moveTo(140, y)
      .lineTo(140, y + h)
      .stroke();
    doc
      .moveTo(250, y)
      .lineTo(250, y + h)
      .stroke();
    doc
      .moveTo(400, y)
      .lineTo(400, y + h)
      .stroke();
    doc
      .moveTo(500, y)
      .lineTo(500, y + h)
      .stroke();

    // X
    y += 40;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();

    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
    y += 25;
    doc
      .moveTo(20, y)
      .lineTo(pw - 20, y)
      .stroke();
  };

  const drawApplicants = (y) => {
    applicantData.forEach((a, i) => {
      if ((i % 18 === 0) & (i != 0)) {
        doc.addPage();
        doc.text(a.no, 32, y);
        y += 25;
      } else {
        doc.text(a.no, 32, y);
        y += 25;
      }
    });
  };

  const lineTest = () => {
    doc.moveTo(35, 0).lineTo(35, ph).strokeColor("red").stroke();

    doc.moveTo(95, 0).lineTo(95, ph).strokeColor("red").stroke();

    doc.moveTo(195, 0).lineTo(195, ph).strokeColor("red").stroke();

    doc.moveTo(mid, 0).lineTo(mid, ph).stroke();

    doc.strokeColor("black");
  };

  lineTest();
  drawHeader();
  drawTable(280);
  drawApplicants(325);
  doc.end();
};
