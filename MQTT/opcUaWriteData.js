const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");
require('dotenv').config();
const mail = require("./email");
const { timestampFunction } = require('./timestamp');

async function writeOpcTags(writeValue) {
    
    const client = OPCUAClient.create({ endpoint_must_exist: false });
    const endpointUrl = process.env.OPC_UA_SERVER_URL; // Change to your OPC UA server URL
    const nodeId = "ns=2;s=NeuRealltyDemand"; // Change to your nodeId
    try {
        await client.connect(endpointUrl);
        console.log({ "Connected to OPC UA server": true, timestamp: timestampFunction()});

        const session = await client.createSession();
        console.log({"Session created": true, timestamp: timestampFunction()});
        const valueToWrite = {
            nodeId: nodeId,
            attributeId: AttributeIds.Value,
            value: {
                value: {
                    dataType: DataType.Boolean,
                    value: Boolean(writeValue)
                }
            }
        };
        const statusCode = await session.write(valueToWrite);
        console.log({"Write status": statusCode, timestamp: timestampFunction()});   
        await session.close();
        await client.disconnect();
        console.log({"Disconnected": true, timestamp: timestampFunction()});
    } catch (err) {
        console.log("Error:", err);
    }
};
module.exports = { writeOpcTags };