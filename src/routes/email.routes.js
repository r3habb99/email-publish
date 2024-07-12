const express = require('express');
const uploadMiddleware = require('../config/multerConfig');
const emailController = require('../controllers/emailController');

const router = express.Router();

router.get('/', (req, res) => {
  const successMessage = req.cookies.successMessage || null;
  res.clearCookie('successMessage');
  res.render('index', { successMessage, errorMessage: null });
});


router.post('/send-email', uploadMiddleware, emailController.sendEmail);

module.exports = router;
