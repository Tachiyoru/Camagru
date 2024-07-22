const nodemailer = require("nodemailer");

async function resetor(email, token) {
  console.log(email, token);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const confirmationLink = `http://localhost:3001/reset/${token}`;
  const mailOptions = {
    from: process.env.MAIL_EMAIL,
    to: email,
    subject: "Password reset",
    html: `<p>Hello,</p>
    <p>Please change your password by clicking the following link:</p>
    <a href="${confirmationLink}">Make a new password</a>
    <p>Thank you!</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("error", err);
  }
}

module.exports = resetor;
