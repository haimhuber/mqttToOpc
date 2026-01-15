const mqttClient = require("./mqttInitial");
const mqttPublish = require("./mqttPublish");
const opcUaRead = require("./opcUaReadData");
const opcUaWrite = require("./opcUaWriteData");
const mail = require("./email");
const publishData = async () => {   
    try {
        await mqttPublish.publishData();
        console.log("Published OPC UA Data to MQTT Broker");
    } catch (err) { 
        console.error("Error publishing data:", err);
    }
};

const opcReadData = async () => {   
    try {
        await opcUaRead.readOpcTags();
    } catch (err) {
        console.error("Error reading OPC UA data:", err);
    }
};

mqttClient.mqttClient();
setInterval(publishData, 5000);
//setInterval(opcReadData, 60000); // Read OPC UA data every 60 seconds
// setInterval(() => opcUaWrite.writeOpcTags(1), 5000);
