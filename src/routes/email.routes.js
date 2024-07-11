const express = require('express');
const upload = require('../config/multerConfig');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post(
  '/send-email',
  upload.array('attachments', 6),
  emailController.sendEmail
);

module.exports = router;
