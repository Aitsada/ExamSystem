import PDFDocument from "pdfkit";
import fs from "fs";

export const detailPdf = () => {
  const doc = new PDFDocument({
    size: "A4",
    margins: 20,
  });

  doc.pipe(fs.createWriteStream("./src/pdfKit/detail.pdf"));

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
  const customerID = "เลขประจำตัวสอบ ";
  const room = "ห้องสอบที่ ";
  const building = "ตึก/อาคาร ";

  doc.moveTo(mid, 0).lineTo(mid, h).stroke();
  doc.font(FONT_LIGHT);
  doc.fontSize(11);

  const applicants = Array.from({ length: 60 }, (_, i) => ({
    position: "เจ้าพนักงานตรวจสอบทรัพย์สินปฏิบัติการ",
    AppID: "",
    Prefix: "นาย",
    FirstName: "อิษฎา",
    LastName: "สุวรรณโต",
    customerID: "1219800345942",
    room: "31 (10406) แถวที่ 1 ชั้น 4 ",
    building: "10",
  }));
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

    doc.text(position, x, y, { continued: true });
    doc.font(FONT_BOLD);

    const isSmall = doc.widthOfString(a.position) > 180;
    if (isSmall) {
      doc.fontSize(9);
      doc.text(a.position, x, y + 2);
    } else {
      doc.fontSize(11);
      doc.text(a.position);
    }

    doc.fontSize(11);
    doc.font(FONT_LIGHT);
    doc.text(AppID, x, y + 18, { continued: true });
    doc.font(FONT_BOLD);
    doc.text("65010" + (index + 1));

    doc.font(FONT_LIGHT);
    doc.text(name, x, y + 36, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(a.Prefix, { continued: true });
    doc.text(a.FirstName + " ", { continued: true });
    doc.text(a.LastName);

    doc.font(FONT_LIGHT);
    doc.text(customerID, x, y + 54, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(a.customerID);

    doc.font(FONT_LIGHT);
    doc.text(room, x, y + 72, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(a.room, x, y + 72, { continued: true });
    doc.font(FONT_LIGHT);
    doc.text(building, x, y + 72, { continued: true });
    doc.font(FONT_BOLD);
    doc.text(a.building);
  });
  doc.end();
};
