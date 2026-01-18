const mqttClient = require("./mqttInitial");
const mqttPublish = require("./mqttPublish");
const opcUaRead = require("./opcUaReadData");
const opcUaWrite = require("./opcUaWriteData");
const mail = require("./email");


mqttClient.mqttClient();
setInterval(opcReadData, 10000); // Read OPC UA data every 60 seconds

