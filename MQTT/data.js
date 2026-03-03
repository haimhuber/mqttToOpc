const fs = require("fs");
const writeToOpcTags = require('./opcUaWriteData');
const readOpcData = require('./opcUaReadData');
const { timestampFunction } = require('./timestamp');
const emailHandler = require('./email');

let sensor1Data = [];
let headerWritten = false;
let coolingDemand = false;

const demandLogFile = async function writeToFile(status) {
   // Write one row
  const row = `${timestampFunction()},Demand Value:${status}\n CMW Set To ${status ? 'ON' : 'OFF'}\n`;
  fs.appendFileSync("demandLog.csv", row);
}

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
    console.log("****🔄 Initializing OPC UA write check...****", { timestamp: timestampFunction()});
    if (data.remote_avg_temp_c > 27.5 && await readOpcData.readOpcTags() === false) {
  console.log(`****🔺 Temperature high: ${data.remote_avg_temp_c}, increasing cooling demand. Bit Set To TRUE****`, { timestamp: timestampFunction()});
      await writeToOpcTags.writeOpcTags(true);
      emailHandler.mailHandler(`⚠️ Alert: Cooling demand increased due to high temperature! CWM2 Set to ON. Current Temperature: ${data.remote_avg_temp_c}`);
      coolingDemand = true;
      await demandLogFile(true);
    } else if (data.remote_avg_temp_c < 23 && await readOpcData.readOpcTags() === true) {
  console.log(`****🔻 Temperature low: ${data.remote_avg_temp_c}, decreasing cooling demand. Bit Set To FALSE****`, { timestamp: timestampFunction()});
      await writeToOpcTags.writeOpcTags(false);
      emailHandler.mailHandler(`⚠️ Alert: Cooling demand decreased due to low temperature! CWM2 Set to OFF. Current Temperature: ${data.remote_avg_temp_c}`);
      coolingDemand = false;
      await demandLogFile(false);
    }
    const demandCurrentStatus = await readOpcData.readOpcTags(); // Read current demand status
    if (demandCurrentStatus === null) {
      console.log("****⚠️ Error reading current cooling demand status. OPC Server Down****", { timestamp: timestampFunction()});
      return; // Server Down - exit function
    } 
    if (coolingDemand === demandCurrentStatus) {
      console.log("****✅ Cooling demand status match.****", { timestamp: timestampFunction()});
      loopOpcWrite = false; // Finish loop if status matches
      return;
    }
    const delay = 5000; // 5 seconds delay before retrying
    console.log(`****🔄 Cooling demand status mismatch. Retrying OPC UA write in ${delay / 1000} seconds...****`, { timestamp: timestampFunction()});
    await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
  }
}

// Setpoint example Up to 27.5
// Setpoint example Down to 23


module.exports = { storeData, demandLogFile };
