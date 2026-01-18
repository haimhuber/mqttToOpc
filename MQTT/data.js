const fs = require("fs");
const writeToOpcTags = require('./opcUaWriteData');
const readOpcData = require('./opcUaReadData');
let sensor1Data = [];
let headerWritten = false;
let coolingDemand = false;
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

// Write cooling demand based on temperature
const writeDemand = async function(data) {
  let loopOpcWrite = true;
  while (loopOpcWrite) {
    console.log("****🔄 Initializing OPC UA write check...****", { timestamp: new Date().toISOString()});
    if (data.remote_avg_temp_c > 27.5) {
      console.log("****🔺 Temperature high, increasing cooling demand.****", { timestamp: new Date().toISOString()});
      await writeToOpcTags.writeOpcTags(true);
      coolingDemand = true;
    } else if (data.remote_avg_temp_c < 23) {
      console.log("****🔻 Temperature low, decreasing cooling demand.****", { timestamp: new Date().toISOString()});
      await writeToOpcTags.writeOpcTags(false);
      coolingDemand = false;
    }
    const demandCurrentStatus = await readOpcData.readOpcTags(); // Read current demand status
    if (demandCurrentStatus === null) {
      console.log("****⚠️ Error reading current cooling demand status. OPC Server Down****", { timestamp: new Date().toISOString()});
      return; // Server Down - exit function
    } 
    if (coolingDemand === demandCurrentStatus) {
      console.log("****✅ Cooling demand status match.****", { timestamp: new Date().toISOString()});
      loopOpcWrite = false; // Finish loop if status matches
    }
  }
}

// Setpoint example Up to 27.5
// Setpoint example Down to 23


module.exports = { storeData };
