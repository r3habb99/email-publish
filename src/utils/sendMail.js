const transporter = require('../config/transporter');
const getTemplate = require('./emailTemplates');
const logger = require('./logger');

const sendMail = async (to, subject, replacements, attachments) => {
  const htmlToSend = getTemplate('email', replacements);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlToSend,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
  }
};

module.exports = sendMail;
