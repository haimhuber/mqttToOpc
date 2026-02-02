const dns = require("dns").promises;
const nodemailer = require("nodemailer");
require("dotenv").config();


const mailHandler = async function(text){
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",         // מתחברים ל-IP
    port: 465,
    secure: true,
    auth: { user: process.env.EMAIL_HOST, pass: process.env.EMAIL_API_KEY },
    tls: { servername: "smtp.gmail.com" }, // SNI נכון
    logger: true,
    debug: true,
  });
  await transporter.verify();
  console.log("✅ verify OK");
  let mailCounter = 0;
  while (mailCounter < 3) { // 3 ניסיונות שליחה
    mailCounter++;
    console.log(`📧 send attempt #${mailCounter}`);
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_HOST,
        to: process.env.EMAIL_END_POINT,
        subject: "Zenon Scada - ABB HQ",
        text: text,
      });
      const messageId = info.messageId;
      if (messageId) {
        console.log("✅ send OK, messageId:", messageId);
        break; // יציאה מהלולאה אם השליחה הצליחה    
      } else {
        console.log("⚠️ send OK but no messageId returned");
      }

    } catch (error) {
      console.log("❌ send error:", error);
  }  
  } 
};

module.exports = {mailHandler};

// End of file: MQTT/email.js