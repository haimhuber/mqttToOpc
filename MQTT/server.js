require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const opcUaRead = require("./opcUaReadData");
const opcUaWrite = require("./opcUaWriteData");
const mqttPublish = require("./mqttPublish");
const host = "192.168.1.148";
const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/csv", async (req, res) => {

function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}
  try {
    const filePath = path.join(__dirname, "data.csv");
    const rows = await readCsv(filePath); // מהפונקציה למעלה
    res.json({ ok: true, rows: rows.slice(-10) }); // מחזיר רק את 10 השורות האחרונות
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
const port = Number(process.env.PORT || 3001);
app.listen(port, host, () => console.log(`API listening on http://${host}:${port}`));


module.exports = app;
