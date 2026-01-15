const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");
require('dotenv').config();
const mail = require("./email");


async function writeOpcTags(writeValue) {
    
    const client = OPCUAClient.create({ endpoint_must_exist: false });
    const endpointUrl = process.env.OPC_UA_SERVER_URL; // Change to your OPC UA server URL
    const nodeId = "ns=2;s=NeuRealltyDemand"; // Change to your nodeId
    try {
        await client.connect(endpointUrl);
        console.log("Connected to OPC UA server");

        const session = await client.createSession();
        console.log("Session created");
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
        console.log("Write status:", statusCode);   
        await session.close();
        await client.disconnect();
        mail.mailHandler(writeValue);
        console.log("Disconnected");
    } catch (err) {
        console.log("Error:", err);
    }
};
module.exports = { writeOpcTags };