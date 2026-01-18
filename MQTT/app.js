const mqttClient = require("./mqttInitial");
const mqttPublish = require("./mqttPublish");
const opcUaRead = require("./opcUaReadData");
const opcUaWrite = require("./opcUaWriteData");
const mail = require("./email");

const opcReadData = async () => {   
    try {
        const demandValue = await opcUaRead.readOpcTags();
        console.log("Demand Value for start CWM 2:", demandValue);
    } catch (err) {
        console.error("Error reading OPC UA data:", err);
    }
};
mqttClient.mqttClient();
//setInterval(opcReadData, 10000); // Read OPC UA data every 60 seconds

