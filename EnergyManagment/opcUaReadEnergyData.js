const { OPCUAClient, AttributeIds, DataType } = require("node-opcua");
const sql = require('mssql');
require('dotenv').config();
const { timestampFunction } = require('../MQTT/timestamp');
async function readOpcActiveEnergyTags() {
    const client = OPCUAClient.create({ endpoint_must_exist: false });
    const endpointUrl = process.env.OPC_UA_SERVER_URL; 
    const nodeIds = ["ns=2;s=stCB[1].rActiveEnergy", "ns=2;s=stCB[4].rActiveEnergy"];
    const sqlTables = ["Q0", "Q4"]; 
    let activeEnergy = [];
    try {
        await client.connect(endpointUrl);
    console.log({"Connected to OPC UA server": true, timestamp: timestampFunction()});
        const session = await client.createSession();
    console.log({"Session created": true, timestamp: timestampFunction()});
        // Read a variable node (example nodeId)
        for (const nodeId of nodeIds) {
            const dataValue = await session.readVariableValue(nodeId);
            activeEnergy[nodeId] = dataValue.value.value;
        }
        console.log("Active Energy values:", activeEnergy, { timestamp: timestampFunction() });
        await session.close();
        await client.disconnect();
    } catch (err) {
        console.log("Error:", err);
        console.log("OPC UA Server might be down. Returning null for demand status.", { timestamp: timestampFunction()});
        activeEnergy = null;
    }

    // Save active energy values to SQL Server
    if (activeEnergy) {
        try {
            const pool = await sql.connect({    
                server: process.env.SERVER,
                user: process.env.USER,
                password: process.env.PASSWORD,
                database: process.env.DATABASE,
                options: {
                    encrypt: false,
                    trustServerCertificate: true    
                }
            });
           
            for (const nodeId of nodeIds) {
                 const query = `
                INSERT INTO ${sqlTables[nodeIds.indexOf(nodeId)]} (activeEnergy)
                VALUES (@activeEnergy)
            `;
                const request = pool.request();
                request.input('activeEnergy', sql.Float, activeEnergy[nodeId]);
                await request.query(query);
                console.log(`Active energy value for ${nodeId} saved to SQL Server.`, { timestamp: timestampFunction() });
            }
        } catch (err) {
            console.log("Error saving active energy values to SQL Server:", err);
        }
    }       
}
readOpcActiveEnergyTags();

// module.exports = { readOpcTags };
