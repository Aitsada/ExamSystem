import mysql from "mysql2/promise";
// import "dotenv/config";
import dotenv from "dotenv"

dotenv.config( {path: ".env"})

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  timezone: "+07:00", // เวลาไทย
});

export default db;
