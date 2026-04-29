import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./facility/facility.route.js";

process.env.TZ = process.env.TZ || "Asia/Bangkok";

const app = express();
const port = 8005;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server Running At ${port} `);
});

