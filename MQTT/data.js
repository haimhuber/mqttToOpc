const fs = require("fs");
const writeDemand = require("./opcUaWriteData");
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
  await writeDemand(data);
};


const writeDemand = async function(data) {
  if (data.remote_avg_temp_c > 27.5) {
    console.log("🔺 Temperature high, increasing cooling demand.");
    await writeOpcTags.writeOpcTags(true);
  } else if (data.remote_avg_temp_c < 23) {
    console.log("🔻 Temperature low, decreasing cooling demand.");
    await writeOpcTags.writeOpcTags(false);
  } 
}

// Setpoint example Up to 27.5
// Setpoint example Down to 23





module.exports = { storeData };
