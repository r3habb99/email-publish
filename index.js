const express = require('express');
const bodyParser = require('body-parser');
const emailRoutes = require('./src/routes/email.routes');
const logger = require('./src/utils/logger.utils');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const PROTOCOL = process.env.PROTOCOL || 'http://localhost';

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', emailRoutes);

app.listen(PORT, () => {
  logger.info(`=================================`);
  logger.info(`🚀 App running on this port ${PORT}`);
  logger.info(`🎮 ${PROTOCOL}:${PORT}`);
  //logger.info(`🎮 https://email-braodcast-service.onrender.com`);
  logger.info(`=================================`);
});

module.exports = app;
