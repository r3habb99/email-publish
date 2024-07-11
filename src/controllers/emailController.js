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
      message: message.replace(/\r\n|\r|\n/g, '<br>'), // Replace newlines with <br> for HTML formatting
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
    const successMessage = 'Emails sent successfully!';
    return res.render('index', { successMessage, errorMessage: null }); // Render index.ejs with successMessage
  } catch (error) {
    logger.error('Failed to send emails: ' + error.message);
    const errorMessage =
      'Failed to send emails. Please check the logs for more details.';
    return res.render('index', { successMessage: null, errorMessage }); // Render index.ejs with errorMessage
  }
};

module.exports = { sendEmail };
