const path = require('path');
const express = require('express');
const { webRouter } = require('./routes/web');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use('/public', express.static(path.join(__dirname, '..', 'public')));

  app.use(webRouter);

  return app;
}

module.exports = {
  createApp
};
