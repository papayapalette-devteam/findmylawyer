const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: '"Admin Team" <admin@example.com>',
    to,
    subject,
    text
  });
};
