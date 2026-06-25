// create a document and pipe to a blob
import PDFDocument from "pdfkit";
import fs from "fs";

export const pdfFile = () => {
  const doc = new PDFDocument();
  const output = "./src/pdfKit/file.pdf";
  doc.pipe(fs.createWriteStream(output));

  const applicants = [
    { name: "ronaldo", id: "7" },
    { name: "mbappe", id: "10" },
    { name: "haaland", id: "9" },
    { name: "messi", id: "10" },
  ];
  const pageWidth = doc.page.width;
  console.log(pageWidth);
  doc.font("./src/fonts/Sarabun-SemiBold.ttf");
  doc.fontSize(16)
  doc.text("ห้องสอบที่ 31", { align: "center" });
  doc.fontSize(12)
  doc.font("./src/fonts/Sarabun-Regular.ttf");
  doc.text("การสอบแข่งขันเพื่อบรรจุและแต่งตั้งบุคคลเข้ารับราชการ", {
    align: "center",
  });
  doc.text(
    "ตำแหน่ง เจ้าพนักงานตรวจสอบทรัพย์สินปฏิบัติการ เลขประจำตัวสอบ 100001 ถึง 100030",
    { align: "center" },
  );
  doc.text("สอบวันอาทิตย์ที่ 22 มีนาคม 2569 เวลา 09:00 - 12:00 น.", {
    align: "center",
  });
  doc.text("สถานที่สอบ มหาวิทยาลัยสวนดุสิต ตึก/อาคาร 10 ชั้น 4 ห้อง 10406", {
    align: "center",
  });
  
  let y = 250;

  applicants.forEach((a, index) => {
    doc.text(index + 1, 50, y);
    doc.text(a.name, 90, y);
    doc.text(a.id, 300, y);

    y += 25;
  });

  doc.end();
};

pdfFile();
