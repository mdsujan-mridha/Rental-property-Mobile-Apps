const nodemailer = require("nodemailer");
const sendToken = require("./jwtToken");

const sendEmail = async (option) => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.appPassword
        },
    });
    const mailOptions = {
        from: "nextbdsite3@gmail.com",
        to: option.email,
        subject: option.subject,
        text: option.text
    }
    await transporter.sendMail(mailOptions)
}
module.exports = sendEmail;