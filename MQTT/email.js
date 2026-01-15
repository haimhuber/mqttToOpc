const nodemailer = require('nodemailer');
require('dotenv').config();
async function mailHandler(value) {

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_HOST, pass: process.env.EMAIL_API_KEY },
  logger: true,
  debug: true,
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});


    // הגדרת ההודעה
    const mailOptions = {
        from: process.env.EMAIL_HOST,
        to: process.env.EMAIL_END_POINT,
        subject: 'Zenon Scada',
        text: `NeuReality Demand Set To ${value}: CWM 2(AEMAC) is set on to ${value}`
    };

    // שליחה
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error Sending:', error);
        if (error.response) {
            console.error('SMTP Response:', error.response);
        }
        if (error.code) {
            console.error('Error Code:', error.code);
        }
        if (error.command) {
            console.error('Error Command:', error.command);
        }
    }
}


module.exports = { mailHandler };