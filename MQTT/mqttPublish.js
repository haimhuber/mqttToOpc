var mqtt = require('mqtt');
const dotenv = require('dotenv');
dotenv.config();
var options = {
        host: process.env.BROKER_URL,
        port: 8883,
        protocol: 'mqtts',
        username: process.env.USER,
        password: process.env.PASSWORD,
        rejectUnauthorized: false
    };
    payload = {
        vertivTemp : 22.5,
        vertivHumidity : 55,
        vertivPressure : 1013.25,
        setpoint : 23.0,
        timestamp : new Date().toISOString()
    };

async function publishData() {
    var client = mqtt.connect(options);
    try {
        // Update timestamp before publishing
        payload.timestamp = new Date().toISOString();
        client.publish(process.env.TOPIC, JSON.stringify(payload), () => {
            console.log("Published data to topic:", process.env.TOPIC);
        });
    } catch (err) {
        console.log("Error publishing data:", err);
    }
}

module.exports = { publishData };