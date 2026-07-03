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

    const x = 20;
    y = 295;

    const number = "ลำดับที่";
    const appID = "เลขประจำตัวสอบ";
    const customerID = "เลขประจำตัวประชาชน";
    const fullname = "ชื่อ-นามสกุล";
    const examNumber = "รหัสชุด";
    const examNumber2 = "แบบทดสอบ";
    const sign = "ลายมือชื่อ";
    const sign2 = "(ตัวบรรจง)";
    doc.text(number, x + findRange(6) / 2 - wos(number), y);
    doc.text(appID, x + findRange(26) / 2 - wos(appID), y);
    doc.text(customerID, x + findRange(58) / 2 - wos(customerID), y);
    doc.text(fullname, x + findRange(100) / 2 - wos(fullname), y);
    doc.text(examNumber, x + findRange(143) / 2 - wos(examNumber), y - 10);
    doc.text(examNumber2, x + findRange(143) / 2 - wos(examNumber2), y + 10);
    doc.text(sign, x + findRange(181) / 2 - wos(sign), y - 10);
    doc.text(sign2, x + findRange(181) / 2 - wos(sign2), y + 10);

    // Create Table
    doc.lineWidth(0.1);

    const w = pw - 40;
    const h = 40;
    doc.rect(20, 280, pw - 40, h).stroke();

    y = 350;
    doc
      .moveTo(x + findRange(6), 280)
      .lineTo(x + findRange(6), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(20), 280)
      .lineTo(x + findRange(20), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(38), 280)
      .lineTo(x + findRange(38), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(62), 280)
      .lineTo(x + findRange(62), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(81), 280)
      .lineTo(x + findRange(81), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(100), 280)
      .lineTo(x + findRange(100), 320)
      .stroke();
    y += 20;
  };

  function findRange(x) {
    return (doc.page.width - 40) * (x / 100);
  }
  const applicantData = Array.from({ length: 60 }, (_, i) => ({
    no: i + 1,
    appID: "10001",
    customerID: "1219800371284",
    prefix: "นาย",
    firstName: "สิริประภัสสรวรรณรัตน์",
    lastName: "พิชญ์พงศ์สิริโชติ",
  }));

  const drawTable = (y) => {
    doc.lineWidth(0.1);

    const w = pw - 40;
    const h = 490;
    doc.rect(20, y, pw - 40, h).stroke();
    // Horizon
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
      .moveTo(490, y)
      .lineTo(490, y + h)
      .stroke();

    // Vertical
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

  console.log(11 % 10 >= 1);
  const drawApplicants = (y) => {
    let h = 0;
    applicantData.forEach((a, i) => {
      const x = 20;
      if ((i % 18 === 0) & (i != 0)) {
        if (i % 10 > 1) {
          h = 0;
          doc.addPage();
          drawHeader();
          y = 325;
          dataTable(20, h);
          doc.text(a.no, x + findRange(6) / 2 - wos(String(a.no)), y);
          doc.text(a.appID, x + findRange(26) / 2 - wos(a.appID), y);
          doc.text(a.customerID, x + findRange(58) / 2 - wos(a.customerID), y);
          y += 25;
          h += 25;
        }
      } else {
        doc.fontSize(9.5);
        dataTable(20, h);
        doc.text(a.no, x + findRange(6) / 2 - wos(String(a.no)), y);
        doc.text(a.appID, x + findRange(26) / 2 - wos(a.appID), y);
        doc.text(a.customerID, x + findRange(58) / 2 - wos(a.customerID), y);
        doc.text(a.prefix, x + findRange(39), y, {
          continued: true,
        });
        doc.text(a.firstName, x + findRange(39), y);
        doc.text(a.lastName, x + findRange(60), y);
        y += 25;
        h += 25;
      }
    });
  };

  const dataTable = (x, h) => {
    doc
      .moveTo(x, 320 + h)
      .lineTo(x, 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(6), 320 + h)
      .lineTo(x + findRange(6), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(20), 320 + h)
      .lineTo(x + findRange(20), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(38), 320 + h)
      .lineTo(x + findRange(38), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(62), 320 + h)
      .lineTo(x + findRange(62), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(81), 320 + h)
      .lineTo(x + findRange(81), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(100), 320 + h)
      .lineTo(x + findRange(100), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(0), 345 + h)
      .lineTo(x + findRange(100), 345 + h)
      .stroke();
  };
  const lineTest = () => {
    doc.strokeColor("red");
    const x = 20;
    doc
      .moveTo(x + findRange(6) / 2, 0)
      .lineTo(x + findRange(6) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(26) / 2, 0)
      .lineTo(x + findRange(26) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(58) / 2, 0)
      .lineTo(x + findRange(58) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(100) / 2, 0)
      .lineTo(x + findRange(100) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(143) / 2, 0)
      .lineTo(x + findRange(143) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(181) / 2, 0)
      .lineTo(x + findRange(181) / 2, ph)
      .stroke();

    // Center title
    doc.strokeColor("green");
    doc
      .moveTo(mid - 70, 0)
      .lineTo(mid - 70, ph)
      .stroke();

    doc
      .moveTo(mid + 70, 0)
      .lineTo(mid + 70, ph)
      .stroke();

    doc.strokeColor("blue");
    doc.moveTo(mid, 0).lineTo(mid, ph).stroke();

    doc.strokeColor("black");
  };

  const bottomPage = () => {
    const text =
      "ข้าพเจ้าได้ตรวจสอบใบหน้าและเลขประจําตัวประชาชนของผู้สอบทุกคนแล้ว ปรากฎว่า";
    const text1 = "เหมือนกับบัตรประจําตัวประชาชน";
    const text2 = "มีปัญหา";
    const text3 = "ยุติการสอบ";
    doc.fontSize(9.5);
    doc.text(text, 20, 50);

    doc.rect(20, 50 + 23, 8, 8).stroke();
    doc.text(text1, 20 + 13, 50 + 20);

    const amount = "จำนวน ........... ราย";
    const appId1 =
      "เลขประจำตัวสอบ...................................................................................................................................................................";
    const appId2 =
      "เลขประจำตัวสอบ..............................................................................................................................................................";

    const dotSpace =
      "......................................................................................................................................................................................................................................................";
    doc.rect(20, 50 + 23 + 20, 8, 8).stroke();
    doc.text(text2, 20 + 13, 50 + 40, { continued: true });
    doc.text(amount, 20 + 13 + 3, 50 + 40, { continued: true });
    doc.text(appId1, 20 + 13 + 6, 50 + 40);

    doc.rect(20, 50 + 23 + 40, 8, 8).stroke();
    doc.text(text3, 20 + 13, 50 + 60, { continued: true });
    doc.text(amount, 20 + 13 + 3, 50 + 60, { continued: true });
    doc.text(appId2, 20 + 13 + 6, 50 + 60);
    doc.text(dotSpace, 20, 50 + 80);
    doc.text(dotSpace, 20, 50 + 100);

    const supervisor1 =
      "ลงชื่อผู้ตรวจสอบ..............................................................................";
    doc.text(supervisor1, 230, 50 + 140, { continued: true });
    const supervisor2 = "(เจ้าหน้าที่คุมสอบ)";
    doc.text(supervisor2, 230, 50 + 140);
    const fullnameSupervisor =
      "(.................................................................)";
    doc.text(fullnameSupervisor, 310, 50 + 160);
  };

  lineTest();
  drawHeader();
  drawApplicants(325);
  doc.end();
};
