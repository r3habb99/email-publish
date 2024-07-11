const express = require('express');
const uploadMiddleware = require('../config/multerConfig');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/send-email', uploadMiddleware, emailController.sendEmail);

module.exports = router;
