import PDFDocument from "pdfkit";
import fs from "fs";

export const roomLayout = async (data) => {
  console.log("test")
  const {
    roomNo,
    roomName,
    floorNumber,
    buildingName,
    rows,
    columns,
    facilityName,
    dateTime,
  } = data;

  const applicants = []
    .concat(data.applicantNumbers || data["applicantNumbers[]"] || [])
    .filter((applicantNumber) => applicantNumber);
  const applicantCount = applicants.length;
  const columnCount = Number(columns) || 0;
  const rowCount = Number(rows) || 0;

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 30,
  });
  const stream = fs.createWriteStream("./src/pdfKit/roomLayout.pdf");
  doc.pipe(stream);

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
  const seatLayout_Data = facilityName;
  const seatLayoutOneLine = seatLayoutText + " " + seatLayout_Data;
  doc.text(seatLayoutOneLine, center(seatLayoutOneLine), y);
  y += 25;

  const date_Data = dateTime;
  doc.text(date_Data, center(date_Data), y);
  y += 25;
  const room_No = roomNo;
  const floor_Number = floorNumber;
  const building_Name = buildingName;
  const roomOneLine =
    "ห้องสอบที่ " +
    room_No +
    " (" +
    roomName +
    ")" +
    " ชั้น " +
    floor_Number +
    " ตึก/อาคาร " +
    building_Name;
  doc.text(roomOneLine, ml + 50, y);
  y += 25;
  
  const headerText = "หน้าห้องสอบ";
  doc.text(headerText, center(headerText), y);
  y += 25;

  doc.font(FONT_REGULAR);
  doc.fontSize(10);

  const rowText = "แถวที่";
  doc.text(rowText, ml + 70 - wos(rowText), y);

  //  >>>>> Table <<<<<
  let axisX = 0;
  let axisY = 0;
  let space = 5;
  const ratio = 100 / columnCount;

  const marginLeft = ml + 100;
  const widthOfPage = pw * 0.1;
  let columnX = 150;
  for (let i = 1; i <= columnCount; i++) {
    doc.text(
      i,
      marginLeft +
        table(axisX) +
        table(ratio) -
        table(ratio) / 2 -
        wos(String(i)) +
        space / 2,
      y,
    );
    axisX += ratio;
  }
  y += 25;

  for (let i = 1; i <= rowCount; i++) {
    doc.text(i, ml + 70 - wos(String(i)), y);
    y += 25;
  }

  doc.font(FONT_BOLD);
  doc.fontSize(11);
  const amountText = "จำนวน";
  const appAmount_Data = String(applicantCount);
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
  axisX = 0;
  applicants.forEach((app, i) => {
    i += 1;
    const applicantNumber = String(app);
    for (let j = i; j <= i; j++) {
      doc
        .rect(
          marginLeft + table(axisX) + space,
          y + axisY,
          table(ratio) - space,
          15,
        )
        .stroke();
      doc.text(
        applicantNumber,
        marginLeft +
          table(axisX) +
          table(ratio) / 2 -
          wos(applicantNumber) +
          space / 2,
        y,
      );
      y += 25;
      b += 25;
      if (j % rowCount === 0 && j > 0) {
        axisY = 0;
        axisX += ratio;
        columnX += 105;
        y = 155;

        a += 105;
        b = 153;
      }
    }
  });

  function table(x) {
    const frame = pw - marginLeft - widthOfPage;
    const range = frame * (x / 100);
    return range;
  }

  doc.strokeColor("red");
  // doc.moveTo(mid, 0).lineTo(mid, ph).stroke();
  doc.end();
  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};
