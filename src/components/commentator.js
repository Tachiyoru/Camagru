const nodemailer = require("nodemailer");

async function commentator(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_EMAIL,
    to: email,
    subject: "Comment Notification",
    html: `<p>Hello,</p>
    <p>A user has commented your picture</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("error", err);
  }
}

module.exports = commentator;
