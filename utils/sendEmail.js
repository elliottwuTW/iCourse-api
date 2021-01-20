const nodemailer = require('nodemailer')

const sendEmail = async (receiverInfo) => {
  // create reusable transporter object using gmail service
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `${process.env.SMTP_NAME} <${process.env.SMTP_FROM}>`,
    to: receiverInfo.email,
    subject: receiverInfo.subject,
    text: receiverInfo.message
  })

  console.log('Message sent: %s', info.messageId)
}

module.exports = sendEmail
