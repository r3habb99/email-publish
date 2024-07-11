const express = require('express');
const bodyParser = require('body-parser');
const emailRoutes = require('./src/routes/email.routes');
const logger = require('./src/utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', emailRoutes);

app.listen(PORT, () => {
  logger.info(`=================================`);
  logger.info(`🚀 App running on this port ${PORT}`);
  logger.info(`🎮 http://localhost:${PORT}`);
  logger.info(`=================================`);
});

module.exports = app;
