const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const logger = require('./logger');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Use correct Gmail SMTP host
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getTemplate = (templateName, replacements) => {
  try {
    const filePath = path.join(__dirname, 'templates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    return template(replacements);
  } catch (error) {
    logger.error(`Error reading template: ${error.message}`);
    throw new Error('Error reading email template');
  }
};

const sendMail = async (to, subject, replacements, attachments) => {
  const htmlToSend = getTemplate('email', replacements);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlToSend,
    attachments: [
      {
        filename: 'advertise.jpg',
        path: path.join(__dirname, 'uploads', 'advertise.jpg'),
        cid: 'advertisementImage', // same cid value as in the html img src
      },
      ...attachments, // Other attachments if any
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
  }
};

module.exports = sendMail;
