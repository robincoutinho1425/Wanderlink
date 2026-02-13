const nodemailer = require("nodemailer");

const sendResetEmail = (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com", // Replace with your email
      pass: "your-email-password", // Replace with your app password
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com", // Replace with your email
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
