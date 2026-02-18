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


mqttClient.mqttClient();
setInterval(opcReadData, 10000); // Read OPC UA data every 10 seconds

const scheduleDailyReportAtSix = () => {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(18, 0, 0, 0);

    if (now >= nextRun) {
        nextRun.setDate(nextRun.getDate() + 1);
    }

    const delayMs = nextRun.getTime() - now.getTime();
    console.log(`[DailyReport] Scheduled next run at ${nextRun.toLocaleString()}`);
    setTimeout(() => {
        console.log(`[DailyReport] Running daily report at ${new Date().toLocaleString()}`);
        sendDailyReport();
        setInterval(sendDailyReport, 24 * 60 * 60 * 1000);
    }, delayMs);
};

scheduleDailyReportAtSix();

    
