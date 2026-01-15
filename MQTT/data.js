const fs = require("fs");
const opc = require("./opcUaReadData");
let sensor1Data = [];
let headerWritten = false;

const storeData = async function (data) {
  sensor1Data.push(data);

  // Write header only once
  if (!headerWritten && fs.existsSync("data.csv") === false) {
    const headers = Object.keys(data).join(",") + "\n";
    fs.appendFileSync("data.csv", headers);
    headerWritten = true;
  }

  // Write one row
  const row = Object.values(data).join(",") + "\n";
  fs.appendFileSync("data.csv", row);

  console.log("✅ Stored:", data);
};


// Setpoint example Up to 27.5
// Setpoint example Down to 23





module.exports = { storeData };
