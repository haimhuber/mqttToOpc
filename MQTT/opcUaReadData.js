const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");
require('dotenv').config();


async function readOpcTags() {
    const client = OPCUAClient.create({ endpoint_must_exist: false });
    const endpointUrl = process.env.OPC_UA_SERVER_URL; // Change to your OPC UA server URL
    const nodeId = "ns=2;s=NeuRealltyDemand"; // Change to your nodeId
    const ClientNodeId = "ns=2;s=OpcServerOperatedBy"; // Change to your nodeId
    const clientName = "Comp BMS01"; // Example client name to write
    let demandForCwm2 = null;
    try {
        await client.connect(endpointUrl);
        console.log("Connected to OPC UA server");
        const session = await client.createSession();
        console.log("Session created");
        // Read a variable node (example nodeId)
        const dataValue = await session.readVariableValue(nodeId);
        console.log("Value:", dataValue.value.value);
        demandForCwm2 = dataValue.value.value;
        await session.close();
        await client.disconnect();
        console.log("Disconnected");
    } catch (err) {
        console.log("Error:", err);
    }

    // Wtire Client ID name 
     try {
            await client.connect(endpointUrl);
            console.log("Connected to OPC UA server");
    
            const session = await client.createSession();
            console.log("Session created");
            const valueToWrite = {
                nodeId: ClientNodeId,
                attributeId: AttributeIds.Value,
                value: {
                    value: {
                        dataType: DataType.String,
                        value: String(clientName)
                    }
                }
            };
            const statusCode = await session.write(valueToWrite);
            console.log("Write status:", statusCode);   
            await session.close();
            await client.disconnect();
            console.log("Disconnected");
        } catch (err) {
            console.log("Error:", err);
        }
        return demandForCwm2;
}


module.exports = { readOpcTags };
