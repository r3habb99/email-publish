const sendMail = require('../utils/sendMail');
const logger = require('../utils/logger');

const sendEmail = async (req, res) => {
  const { recipients, subject, message, buttonLink, buttonText } = req.body;
  const attachments = req.files; // req.files contains the array of attachments

  const recipientList = recipients.split(',').map((email) => email.trim());

  const attachmentList = attachments.map((file) => ({
    filename: file.originalname,
    path: file.path,
  }));

  try {
    const replacements = {
      subject,
      message,
      buttonLink,
      buttonText,
      year: new Date().getFullYear(),
    };

    await Promise.all(
      recipientList.map((email) =>
        sendMail(email, subject, replacements, attachmentList)
      )
    );

    logger.info('Emails sent successfully');
    res.status(200).send('Emails sent successfully');
  } catch (error) {
    logger.error('Failed to send emails: ' + error.message);
    res.status(500).json({ error: 'Failed to send emails' });
  }
};

module.exports = { sendEmail };