const nodemailer = require('nodemailer')

const sendEmail = async (receiverInfo) => {
  // create reusable transporter object using gmail service
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD
    }
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.GMAIL_USER}>`,
    to: receiverInfo.email,
    subject: receiverInfo.subject,
    html: receiverInfo.html
  })

  console.log(`Message sent: ${info.messageId}`.yellow.bold)
}

module.exports = sendEmail
