import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./index.route.js";
import { pdfFile } from "./pdfKit/aigen.js";
import { pdfFileTest } from "./pdfKit/test.js";
import { detailPdf } from "./pdfKit/Detail.js";
import { signedDocument } from "./pdfKit/signedDocument.js";
import { roomLayout } from "./pdfKit/roomLayout.js";

process.env.TZ = process.env.TZ || "Asia/Bangkok";

const app = express();
const port = 8005;

app.use(cors());
app.use(express.json());

pdfFile();
pdfFileTest();
detailPdf();
signedDocument();
roomLayout();
app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/", router);

app.use((err, req, res, next) => {
  return res.status(400).json({
    status: "fail",
    message: err.message,
  });
});

app.listen(port);
