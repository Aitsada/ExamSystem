import express from "express";
import db from "../config/db.js"
import b from "../config/test.js"

const app = express();
const port = 8005;


app.get("/", (req, res) => {
  res.send("<div><h1>Aitsada</h1><br/><h2>Suwannato</h2></div>");
});

app.listen(port, () => {
  console.log(`Server Running At ${port} `);
});
