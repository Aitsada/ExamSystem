import PDFDocument from "pdfkit";
import fs from "fs";

export const stickerIdPDF = async (data) => {
  const {
    roomNo,
    roomName,
    buildingName,
    positionName,
    applicantNumber,
  } = data;

  const applicants = []
    .concat(data.applicants || [])
    .filter((applicant) => applicant);
  const doc = new PDFDocument({
    size: "A4",
    margins: 20,
  });

  const stream = fs.createWriteStream("./src/pdfKit/stickerID.pdf");
  doc.pipe(stream);

  const FONT_LIGHT = "./src/fonts/Sarabun-Light.ttf";
  const FONT_REGULAR = "./src/fonts/Sarabun-Regular.ttf";
  const FONT_BOLD = "./src/fonts/Sarabun-SemiBold.ttf";

  //   layout
  const mid = doc.page.width / 2;
  const h = doc.page.height;
  const w = doc.page.width;
  const LEFT_X = 30;
  const RIGHT_X = mid + 30;

  //   label
  const position = "ตำแหน่ง ";
  const AppID = "เลขประจำตัวสอบ ";
  const name = "ชื่อ ";
  const citizenNumber = "เลชประจำตัวประชาชน ";
  const room = "ห้องสอบที่ ";
  const building = " ตึก/อาคาร ";

  // doc.moveTo(mid, 0).lineTo(mid, h).stroke();
  doc.font(FONT_LIGHT);
  doc.fontSize(11);
  const START_Y = 30;
  const BLOCK_HEIGHT = 120;
  const MAX_BLOCK_PER_PAGE = 6;

  applicants.forEach((a, index) => {
    const pageIndex = index % 12;

    if (index > 0 && pageIndex === 0) {
      doc.addPage();
    }
    const col = pageIndex % 2;
    const row = Math.floor(pageIndex / 2);
    const x = col === 0 ? LEFT_X : RIGHT_X;
    const y = START_Y + row * BLOCK_HEIGHT;

    doc.font(FONT_REGULAR);
    doc.text(position, x, y, { continued: true });
    doc.font(FONT_BOLD);

    const isSmall = doc.widthOfString(positionName) > 180;
    if (isSmall) {
      doc.fontSize(9);
      doc.text(positionName, x, y + 2);
    } else {
      doc.fontSize(11);
      doc.text(positionName);
    }
    doc.fontSize(11);
    doc.font(FONT_LIGHT);
    doc.text(AppID, x, y + 18, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(a.ApplicantNumber);

    doc.font(FONT_LIGHT);
    doc.text(name, x, y + 36, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(a.Prefix, { continued: true });
    doc.text(a.FirstName + " ", { continued: true });
    doc.text(a.LastName);

    doc.font(FONT_LIGHT);
    doc.text(citizenNumber, x, y + 54, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(a.CitizenNumber);

    doc.font(FONT_LIGHT);
    doc.text(room, x, y + 72, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(String(roomNo), x, y + 72, { continued: true });
    doc.text(' (', x, y + 72, { continued: true });
    doc.text(roomName, x, y + 72, { continued: true });
    doc.text(') ', x, y + 72, { continued: true });
    doc.font(FONT_LIGHT);
    doc.text(building, x, y + 72, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(buildingName);
  });

  doc.end();
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};
