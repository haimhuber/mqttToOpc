const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const mail = require("./email");
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

function getTodayString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
}

async function getTodayRowsFromCsv() {
  try {
    const filePath = path.join(__dirname, "data.csv");
    const rows = await readCsv(filePath);

    const today = getTodayString();

    const todayRows = rows.filter(r =>
      r.timestamp && r.timestamp.startsWith(today)
    );

    let temp = 0;
    for (const row of todayRows) {
        temp += parseFloat(row.remote_avg_temp_c);
    }
    const avgTemp = todayRows.length ? temp / todayRows.length : 0;
    console.log({ ok: true, averageTemp: Math.floor(avgTemp).toFixed(1) });
    mail.mailHandler(
      `Daily Temperature Report - Neurality Vertiv\n,
      The average temperature for ${today} is ${Math.floor(avgTemp).toFixed(1)}°C.`
    );  
  } catch (e) {
    console.log({ ok: false, error: e.message });
  }
}

module.exports = { getTodayRowsFromCsv };
