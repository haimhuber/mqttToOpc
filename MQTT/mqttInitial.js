const dotenv = require('dotenv');
dotenv.config();
const storeData = require('./data.js').storeData;
const writeOpcTags = require('./vertivOpcData.js');
const getTimestamp = require('./data.js');
var mqtt = require('mqtt');
var options = {
        host: process.env.BROKER_URL,
        port: 8883,
        protocol: 'mqtts',
        username: process.env.USER,
        password: process.env.PASSWORD,
        rejectUnauthorized: false
    };

async function mqttClient() {

    // initialize the MQTT client
    var client = mqtt.connect(options);

    // setup the callbacks
    client.on('connect', function () {
        console.log('MQTT Client Connected to broker', { timestamp: getTimestamp.timestampFunction()});
    });

    client.on('error', function (error) {
        console.log(error);
    });

    client.on('message',  (topic, message) => {  
        // called each time a message is received
        try {
            const msgStr = message.toString();
            const parsed = JSON.parse(msgStr);
            console.log("Parsed JSON message received:", parsed, { timestamp: getTimestamp.timestampFunction()});
            storeData(parsed);
            writeOpcTags.writeVertivTags(parsed);
            // Only parse if message looks like JSON
        } catch (e) {
            console.log("Error parsing message:", e);
        }
    });

    // subscribe to topic 'my/test/topic'
    client.subscribe(process.env.TOPIC, () => {
        console.log({ subscribedTo: process.env.TOPIC, timestamp: getTimestamp.timestampFunction() });
        // publish a message to the topic;
        
    });
}

module.exports = { mqttClient };