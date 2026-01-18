const { OPCUAClient, AttributeIds, DataType, timestamp } = require("node-opcua");
require('dotenv').config();
const getTimestamp = require('./data.js');
async function writeVertivTags(writeValue) {
    
    const client = OPCUAClient.create({ endpoint_must_exist: false });
    const endpointUrl = process.env.OPC_UA_SERVER_URL; // Change to your OPC UA server URL
    const nodeIds = ["ns=2;s=vertiv_fan_speed_pct", "ns=2;s=vertiv_remote_avg_temp_c", 
                    "ns=2;s=vertiv_return_air_temp_c", "ns=2;s=vertiv_supply_air_temp_c"]; // Change to your nodeId
    vertivData = [writeValue.fan_speed_pct, writeValue.remote_avg_temp_c, 
                   writeValue.return_air_temp_c, writeValue.supply_air_temp_c]; 
    console.log({vertiv: vertivData, timestamp: getTimestamp.timestampFunction()});
    
    for (let i = 0; i < nodeIds.length; i++) {
        try {
        await client.connect(endpointUrl);
        console.log({"Connected to OPC UA server": true, timestamp: getTimestamp.timestampFunction()});
        const session = await client.createSession();
        console.log({"Session created": true, timestamp: getTimestamp.timestampFunction()});
        const valueToWrite = {
            nodeId: nodeIds[i],
            attributeId: AttributeIds.Value,
            value: {
                value: {
                    dataType: DataType.Float,
                    value: parseFloat(vertivData[i])
                }
            }
        };
        const statusCode = await session.write(valueToWrite);
        console.log({"Write status": statusCode, timestamp: getTimestamp.timestampFunction()});   
        await session.close();
        await client.disconnect();
        console.log({"Disconnected": true, timestamp: getTimestamp.timestampFunction()});
    } catch (err) {
        console.log("Error:", err);
    }
    }
};
module.exports = { writeVertivTags };