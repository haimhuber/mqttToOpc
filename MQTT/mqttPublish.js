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

let payload = {
    timestamp: '2026-01-15T17:10:01.812074+02:00',
    supply_air_temp_c: 18.3,
    return_air_temp_c: 35.5,
    fan_speed_pct: 70,
    remote_avg_temp_c: 22.1,
    unit: 'C',
    source: 'vertiv_modbus'
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