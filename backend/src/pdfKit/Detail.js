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

  const applicants = Array.from({ length: 30 }, (_, i) => ({
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
    console.log(row);

    const x = col === 0 ? LEFT_X : RIGHT_X;
    const y = START_Y + row * BLOCK_HEIGHT;

    doc.text(position, x, y, { continued: true });
    doc.text(a.position);

    doc.text(AppID, x, y + 18, { continued: true });
    doc.text(index + 1);

    doc.text(name, x, y + 36, { continued: true });
    doc.text(a.Prefix, { continued: true });
    doc.text(a.FirstName, { continued: true });
    doc.text(a.LastName);

    doc.text(customerID, x, y + 54, { continued: true });
    doc.text(a.customerID);

    doc.text(room, x, y + 72, { continued: true });
    doc.text(a.room, x, y + 72, { continued: true });
    doc.text(building, x, y + 72, { continued: true });
    doc.text(a.building);
  });
  doc.end();
};
