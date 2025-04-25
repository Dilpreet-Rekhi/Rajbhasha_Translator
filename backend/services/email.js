const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"राजभाषा अनुवादक" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent to:', to);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};