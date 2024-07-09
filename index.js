const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendMail = require('./mailer');
const logger = require('./logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send-email', upload.array('attachments'), async (req, res) => {
  const { recipients, subject, title, message, buttonLink, buttonText } =
    req.body;
  const attachments = req.files;

  if (
    !recipients ||
    !subject ||
    !title ||
    !message ||
    !buttonLink ||
    !buttonText
  ) {
    logger.error('Missing required fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const recipientList = recipients.split(',').map((email) => email.trim());

  const attachmentList = attachments.map((file) => ({
    filename: file.originalname,
    path: file.path,
  }));

  try {
    const replacements = {
      subject,
      title,
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
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
