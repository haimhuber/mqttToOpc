const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");
require('dotenv').config();
const { timestampFunction } = require('./timestamp');
async function readOpcTags() {
    const client = OPCUAClient.create({ endpoint_must_exist: false });
    const endpointUrl = process.env.OPC_UA_SERVER_URL; // Change to your OPC UA server URL
    const nodeId = "ns=2;s=NeuRealltyDemand"; // Change to your nodeId
    const ClientNodeId = "ns=2;s=OpcServerOperatedBy"; // Change to your nodeId
    const clientName = "Comp BMS01"; // Example client name to write
    let demandForCwm2 = null;
    try {
        await client.connect(endpointUrl);
    console.log({"Connected to OPC UA server": true, timestamp: timestampFunction()});
        const session = await client.createSession();
    console.log({"Session created": true, timestamp: timestampFunction()});
        // Read a variable node (example nodeId)
        const dataValue = await session.readVariableValue(nodeId);
    console.log({"Value": dataValue.value.value, timestamp: timestampFunction()});
        demandForCwm2 = dataValue.value.value;
        await session.close();
        await client.disconnect();
    } catch (err) {
        console.log("Error:", err);
        console.log("OPC UA Server might be down. Returning null for demand status.", { timestamp: timestampFunction()});
        demandForCwm2 = null;
        return demandForCwm2;
    }

    // Wtire Client ID name 
     try {
            await client.connect(endpointUrl);
            const session = await client.createSession();
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
            await session.close();
            await client.disconnect();
        } catch (err) {
            console.log("Error:", err);
            console.log("OPC UA Server might be down. Unable to write client name.", { timestamp: timestampFunction()});
        }
        return demandForCwm2;
}

module.exports = { readOpcTags };
