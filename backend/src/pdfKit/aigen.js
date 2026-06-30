import PDFDocument from "pdfkit";
import fs from "fs";

export const pdfFile = async () => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 30,
  });

  doc.pipe(fs.createWriteStream("./src/pdfKit/aigen.pdf"));

  const FONT_REGULAR = "./src/fonts/Sarabun-Regular.ttf";
  const FONT_BOLD = "./src/fonts/Sarabun-SemiBold.ttf";


  const applicants = Array.from({ length: 30 }, (_, i) => ({
    seatNo: i + 1,
    examNo: String(100001 + i),
    firstName: `นายอิษฎา`,
    lastName: `สุวรรณโต`,
  }));

  const drawHeader = () => {
    doc.font(FONT_BOLD);
    doc.fontSize(16);
    const md = 0.4;
    doc.text("ห้องสอบที่ 31", {
      align: "center",
    });

    doc.moveDown(1);
    doc.font(FONT_REGULAR);
    doc.fontSize(11);

    doc
      .text("การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ", {
        align: "center",
      })
      .moveDown(md);
    doc
      .text(
        "ตำแหน่ง เจ้าพนักงานตรวจสอบทรัพย์สินปฏิบัติการ เลขประจำตัวสอบ 100001 ถึง 100030",
        {
          align: "center",
        },
      )
      .moveDown(md);

    doc
      .text("สอบวันอาทิตย์ที่ 22 มีนาคม 2569 เวลา 09:00 - 12:00 น.", {
        align: "center",
      })
      .moveDown(md);

    const y = doc.y;

    const text1 = "สถานที่สอบ มหาวิทยาลัยสวนดุสิต ";
    const text2 = "ตึก/อาคาร 10 ชั้น 4 ห้อง 10406";

    const totalWidth = doc.widthOfString(text1) + doc.widthOfString(text2);

    const pageWidth = doc.page.width;

    const startX = (pageWidth - totalWidth) / 2;

    doc.text(text1, startX, y);
    doc.text(text2, startX + doc.widthOfString(text1), y, {
      underline: true,
    });

    doc.y = y + 20;
  };

  const drawTableHeader = (y) => {
    doc.font(FONT_BOLD);
    doc.fontSize(11);

    doc.moveTo(40, y).lineWidth(0.1).lineTo(555, y).stroke();

    doc.text("ลำดับที่นั่งสอบ", 70, y + 8);
    doc.text("เลขประจำตัวสอบ", 190, y + 8);
    doc.text("ชื่อ-นามสกุล", 360, y + 8);

    return y + 40;
  };

  drawHeader();

  let y = drawTableHeader(160);

  doc.font(FONT_REGULAR);

  applicants.forEach((applicant, index) => {
    // 740
    if (y > 740) {
      doc.addPage();
      drawHeader();

      y = drawTableHeader(160);

      doc.font(FONT_REGULAR);
    }
    doc.fontSize(10);

    doc.text(String(applicant.seatNo), 100, y);
    doc.text(applicant.examNo, 210, y);

    doc.text(applicant.firstName, 310, y);

    doc.text(applicant.lastName, 450, y);

    y += 22;
  });

  doc.end();
};
