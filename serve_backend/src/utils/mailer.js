const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  // secure: process.env.EMAIL_SECURE,
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASS,
  // },
});
const mailer = async (to, subject, text, html) => {

    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            text,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return true;
        } catch (error) {
        console.error("Error sending email: ", error);
        return error;
    }
};

module.exports = {
    transporter,
    mailer
}
