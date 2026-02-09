const mqttClient = require("./mqttInitial");
const mqttPublish = require("./mqttPublish");
const opcUaRead = require("./opcUaReadData");
const opcUaWrite = require("./opcUaWriteData");
const dataModule = require("./vetrivDataToMail");
require("./server");

const opcReadData = async () => {
  try {
    const demandValue = await opcUaRead.readOpcTags();
    console.log("Demand Value for start CWM 2:", demandValue);
  } catch (err) {
    console.error("Error reading OPC UA data:", err);
  }
};

const sendDailyReport = async () => {
  try {
    await dataModule.getTodayRowsFromCsv();
  } catch (err) {
    console.error("Error sending daily report:", err);
  }
};

// ✅ ריצה כל יום ב-17:00 (לפי השעון המקומי של השרת)
function scheduleDailyAt17(task) {
  const now = new Date();
  const next = new Date();
  next.setHours(17, 0, 0, 0); // 17:00:00

  // אם כבר עבר 17:00 היום → למחר
  if (now >= next) next.setDate(next.getDate() + 1);

  const msUntilNext = next - now;
  console.log("Next daily report at:", next.toString());

  setTimeout(() => {
    task(); // ריצה ראשונה ב-17:00

    // ואז כל 24 שעות
    setInterval(task, 24 * 60 * 60 * 1000);
  }, msUntilNext);
}

mqttClient.mqttClient();
setInterval(opcReadData, 10000); // Read OPC UA data every 10 seconds
scheduleDailyAt17(sendDailyReport); // ✅ כל יום ב-17:00
