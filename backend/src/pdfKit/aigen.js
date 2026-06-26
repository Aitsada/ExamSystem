import PDFDocument from "pdfkit";
import fs from "fs";

export const pdfFile = () => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 30,
  });

  doc.pipe(fs.createWriteStream("./src/pdfKit/aigen.pdf"));

  const applicants = Array.from({ length: 30 }, (_, i) => ({
    seatNo: i + 1,
    examNo: String(100001 + i),
    firstName: `นายอิษฎา`,
    lastName: `สุวรรณโต`,
  }));

  const FONT_REGULAR = "./src/fonts/Sarabun-Regular.ttf";
  const FONT_BOLD = "./src/fonts/Sarabun-Regular.ttf";

  const drawHeader = () => {
    doc.font(FONT_BOLD);
    doc.fontSize(16);

    doc.text("ห้องสอบที่ 31", {
      align: "center",
    });
    doc.moveDown(1);

    doc.font(FONT_REGULAR);
    doc.fontSize(12);

    doc.text("การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ", {
      align: "center",
    });

    doc.text(
      "ตำแหน่ง เจ้าพนักงานตรวจสอบทรัพย์สินปฏิบัติการ เลขประจำตัวสอบ 100001 ถึง 100030",
      {
        align: "center",
      },
    );

    doc.text("สอบวันอาทิตย์ที่ 22 มีนาคม 2569 เวลา 09:00 - 12:00 น.", {
      align: "center",
    });

    doc.text("สถานที่สอบ มหาวิทยาลัยสวนดุสิต ตึก/อาคาร 10 ชั้น 4 ห้อง 10406", {
      align: "center",
    });
  };

  const drawTableHeader = (y) => {
    doc.font(FONT_BOLD);
    doc.fontSize(12);

    doc.moveTo(40, y).lineTo(555, y).stroke();

    doc.text("ลำดับที่นั่งสอบ", 70, y + 8);
    doc.text("เลขประจำตัวสอบ", 190, y + 8);
    doc.text("ชื่อ-นามสกุล", 360, y + 8);

    return y + 40;
  };

  drawHeader();

  let y = drawTableHeader(150);

  doc.font(FONT_REGULAR);
  doc.fontSize(10)
  applicants.forEach((applicant, index) => {
    if (y > 740) {
      doc.addPage();

      drawHeader();

      y = drawTableHeader(180);

      doc.font(FONT_REGULAR);
    }

    doc.text(String(applicant.seatNo), 100, y);

    doc.text(applicant.examNo, 210, y);

    doc.text(applicant.firstName, 310, y);

    doc.text(applicant.lastName, 450, y)

    y += 22;
  });

  doc.end();
};

pdfFile();
