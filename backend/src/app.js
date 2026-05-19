import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./index.route.js";
import fileUpload from "express-fileupload";

process.env.TZ = process.env.TZ || "Asia/Bangkok";

const app = express();
const port = 8005;

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    abortOnLimit: true,
  }),
);

app.get("/health", (req, res) => {
  res.send("Server is running");
});
app.use("/", router);

app.listen(port, () => {
  console.log(`Server Running At ${port} `);
});
