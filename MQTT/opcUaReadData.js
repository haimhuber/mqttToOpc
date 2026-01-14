const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");
require('dotenv').config();


async function readOpcTags() {
    const client = OPCUAClient.create({ endpoint_must_exist: false });
    const endpointUrl = process.env.OPC_UA_SERVER_URL; // Change to your OPC UA server URL
    const nodeId = "ns=2;s=opcTest"; // Change to your nodeId
    try {
        await client.connect(endpointUrl);
        console.log("Connected to OPC UA server");
        const session = await client.createSession();
        console.log("Session created");
        // Read a variable node (example nodeId)
        const dataValue = await session.readVariableValue(nodeId);
        console.log("Value:", dataValue.value.value);
        await session.close();
        await client.disconnect();
        console.log("Disconnected");
    } catch (err) {
        console.log("Error:", err);
    }
}


module.exports = { readOpcTags };
