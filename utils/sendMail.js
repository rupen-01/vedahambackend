const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, attachments = []) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // port 465 -> always true
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Form Submission" <${process.env.SMTP_USER}>`, // 👈 sender updated
    to,
    subject,
    text,
    attachments,
  });
};

module.exports = sendEmail;
