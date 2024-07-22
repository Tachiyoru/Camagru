const nodemailer = require("nodemailer");

async function validator(email, token) {
  console.log(email, token);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const confirmationLink = `localhost:3001/confirm/${token}`;
  const mailOptions = {
    from: process.env.MAIL_EMAIL,
    to: email,
    subject: "Please confirm your email",
    html: `<p>Hello,</p>
    <p>Please confirm your account by clicking the following link:</p>
    <a href="${confirmationLink}">Confirm Account</a>
    <p>Thank you!</p>`
  };
  try {
    console.log(transporter);
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("error", err);
  }
}

module.exports = validator;
