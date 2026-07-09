import PDFDocument from "pdfkit";
import fs from "fs";

export const signedDocument = async (data) => {
  const {
    positionName,
    dateTime,
    facilityName,
    buildingName,
    floorNumber,
    roomNo,
    roomName,
  } = data;
  const applicants = [].concat(data.applicants).filter((a) => a);
  console.log(applicants);
  const doc = new PDFDocument({
    size: "A4",
    margins: 15,
  });

  const stream = fs.createWriteStream("./src/pdfKit/signedDocument.pdf");
  doc.pipe(stream);
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
  const ml = doc.page.margins.left;
  const mr = doc.page.margins.right;

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
    doc.text(positionText, ml, y, { continued: true });
    doc.text(positionName, ml, y);

    y += 23;
    const dateText = "สอบวัน ";
    doc.text(dateText, ml, y, { continued: true });
    doc.text(dateTime, ml, y);

    y += 23;
    const placeText = "สถานที่สอบ ";
    const collect_Data =
      " ตึก/อาคาร " +
      buildingName +
      " ชั้น " +
      floorNumber +
      " ห้องสอบที่ " +
      roomNo +
      " ห้อง " +
      roomName;
    doc.text(placeText, ml, y, { continued: true });
    doc.text(facilityName, ml, y, { continued: true });
    doc.text(collect_Data, ml + 3, y, { underline: true });

    y += 23;
    const examRoomLeaderText = "ชื่อหัวหน้าห้องสอบ";
    const examSupervisorText = "ชื่อเจ้าหน้าที่คุมสอบ";
    const space1 =
      ".......................................................................";
    doc.text(examRoomLeaderText, ml, y, { continued: true });
    doc.text(space1, ml, y, { continued: true });
    doc.text(examSupervisorText, ml, y, { continued: true });
    doc.text(space1, ml, y);

    y += 23;
    const examAmountText = "จำนวนผู้เข้าสอบ";
    const examAbsentText = "จำนวนผู้ขาดสอบ";
    const space2 = "...............คน";
    doc.text(examAmountText, ml, y, { continued: true });
    doc.text(space2, ml, y, { continued: true });
    doc.text(examAbsentText, ml + 2, y, { continued: true });
    doc.text(space2, ml, y);

    y += 25;

    doc
      .lineWidth(1)
      .moveTo(ml, y)
      .lineTo(pw - ml, y)
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
    doc.text(guidelinesText, ml, y);
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

    const x = ml;
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
    doc.text(customerID, x + findRange(57) / 2 - wos(customerID), y);
    doc.text(fullname, x + findRange(100) / 2 - wos(fullname), y);
    doc.text(examNumber, x + findRange(145) / 2 - wos(examNumber), y - 10);
    doc.text(examNumber2, x + findRange(145) / 2 - wos(examNumber2), y + 10);
    doc.text(sign, x + findRange(182) / 2 - wos(sign), y - 10);
    doc.text(sign2, x + findRange(182) / 2 - wos(sign2), y + 10);

    // Create Head Table
    doc.lineWidth(0.1);

    const w = pw - 40;
    const h = 40;
    doc.rect(ml, 280, pw - ml - mr, h).stroke();

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
      .moveTo(x + findRange(37), 280)
      .lineTo(x + findRange(37), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(63), 280)
      .lineTo(x + findRange(63), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(82), 280)
      .lineTo(x + findRange(82), 320)
      .stroke();
    y += 20;
    doc
      .moveTo(x + findRange(100), 280)
      .lineTo(x + findRange(100), 320)
      .stroke();
    y += 20;
  };

  function findRange(x) {
    return (doc.page.width - ml - mr) * (x / 100);
  }

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

  const drawApplicants = (y) => {
    let h = 0;
    applicants.forEach((a, index) => {
      const numbers = index + 1;
      if ((index % 18 === 0) & (index != 0)) {
        if (index % 10 > 1) {
          h = 0;
          doc.addPage();
          drawHeader();
          y = 325;
          doc.fontSize(9.5);
          dataTable(ml, h);
          doc.text(numbers, ml + findRange(6) / 2 - wos(String(numbers)), y);
          doc.text(
            a.ApplicantNumber,
            ml + findRange(26) / 2 - wos(a.ApplicantNumber),
            y,
          );
          doc.text(
            a.CitizenNumber,
            ml + findRange(57) / 2 - wos(a.CitizenNumber),
            y,
          );
          doc.text(a.Prefix, ml + findRange(38), y, {
            continued: true,
          });
          doc.text(a.FirstName, ml + findRange(38), y);
          doc.text(a.LastName, ml + findRange(52), y);
          y += 25;
          h += 25;
        }
      } else {
        doc.fontSize(9.5);
        dataTable(ml, h);
        doc.text(numbers, ml + findRange(6) / 2 - wos(String(numbers)), y);
        doc.text(
          a.ApplicantNumber,
          ml + findRange(26) / 2 - wos(a.ApplicantNumber),
          y,
        );
        doc.text(
          a.CitizenNumber,
          ml + findRange(57) / 2 - wos(a.CitizenNumber),
          y,
        );
        doc.text(a.Prefix, ml + findRange(38), y, {
          continued: true,
        });
        doc.text(a.FirstName, ml + findRange(38), y);
        doc.text(a.LastName, ml + findRange(52), y);
        y += 25;
        h += 25;
      }
    });

    if (y <= 575) {
      bottomPage(y + 20);
    } else {
      doc.addPage();
      bottomPage();
    }
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
      .moveTo(x + findRange(37), 320 + h)
      .lineTo(x + findRange(37), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(63), 320 + h)
      .lineTo(x + findRange(63), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(82), 320 + h)
      .lineTo(x + findRange(82), 345 + h)
      .stroke();
    doc
      .moveTo(x + findRange(100), 320 + h)
      .lineTo(x + findRange(100), 345 + h)
      .stroke();
    // bottom line
    doc
      .moveTo(x + findRange(0), 345 + h)
      .lineTo(x + findRange(100), 345 + h)
      .stroke();
  };
  const lineTest = () => {
    doc.strokeColor("red");
    const x = ml;
    doc
      .moveTo(x + findRange(6) / 2, 0)
      .lineTo(x + findRange(6) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(26) / 2, 0)
      .lineTo(x + findRange(26) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(57) / 2, 0)
      .lineTo(x + findRange(57) / 2, ph)
      .stroke();

    // doc
    //   .moveTo(x + findRange(100) / 2, 0)
    //   .lineTo(x + findRange(100) / 2, ph)
    //   .stroke();

    doc
      .moveTo(x + findRange(145) / 2, 0)
      .lineTo(x + findRange(145) / 2, ph)
      .stroke();

    doc
      .moveTo(x + findRange(182) / 2, 0)
      .lineTo(x + findRange(182) / 2, ph)
      .stroke();

    // // Center title
    // doc.strokeColor("green");
    // doc
    //   .moveTo(mid - 70, 0)
    //   .lineTo(mid - 70, ph)
    //   .stroke();

    // doc
    //   .moveTo(mid + 70, 0)
    //   .lineTo(mid + 70, ph)
    //   .stroke();

    // doc.strokeColor("blue");
    // doc.moveTo(mid, 0).lineTo(mid, ph).stroke();

    doc.strokeColor("black");
  };

  const bottomPage = (y = 50) => {
    const text =
      "ข้าพเจ้าได้ตรวจสอบใบหน้าและเลขประจําตัวประชาชนของผู้สอบทุกคนแล้ว ปรากฎว่า";
    const text1 = "เหมือนกับบัตรประจําตัวประชาชน";
    const text2 = "มีปัญหา";
    const text3 = "ยุติการสอบ";
    doc.fontSize(9.5);
    doc.text(text, ml, y);

    doc.rect(ml, y + 23, 8, 8).stroke();
    doc.text(text1, ml + 13, y + 20);

    const amount = "จำนวน ...........ราย";
    const appId1 =
      "เลขประจำตัวสอบ...................................................................................................................................................................";
    const appId2 =
      "เลขประจำตัวสอบ..............................................................................................................................................................";

    const dotSpace =
      "......................................................................................................................................................................................................................................................";
    doc.rect(ml, y + 23 + 20, 8, 8).stroke();
    doc.text(text2, ml + 13, y + 40, { continued: true });
    doc.text(amount, ml + 13 + 3, y + 40, { continued: true });
    doc.text(appId1, ml + 13 + 6, y + 40);

    doc.rect(ml, y + 23 + 40, 8, 8).stroke();
    doc.text(text3, ml + 13, y + 60, { continued: true });
    doc.text(amount, ml + 13 + 3, y + 60, { continued: true });
    doc.text(appId2, ml + 13 + 6, y + 60);
    doc.text(dotSpace, ml, y + 80);
    doc.text(dotSpace, ml, y + 100);

    const supervisor1 =
      "ลงชื่อผู้ตรวจสอบ..............................................................................";
    doc.text(supervisor1, 230, y + 140, { continued: true });
    const supervisor2 = "(เจ้าหน้าที่คุมสอบ)";
    doc.text(supervisor2, 230, y + 140);
    const fullnameSupervisor =
      "(.................................................................)";
    doc.text(fullnameSupervisor, 310, y + 160);
  };

  // lineTest();
  drawHeader();
  drawApplicants(325);
  // if (applicantData.length > 10) {
  //   doc.addPage();
  //   bottomPage();
  // }
  doc.end();
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};
