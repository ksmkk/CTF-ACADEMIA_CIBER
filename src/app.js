const path = require('path');
const express = require('express');
const { requireLevel } = require('./middleware/requireLevel');
const { requireWarmup } = require('./middleware/requireWarmup');
const { webRouter } = require('./routes/web');

function createApp() {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use('/public', express.static(path.join(__dirname, '..', 'public')));

  app.use('/nivel1', requireWarmup, express.static(path.join(__dirname, '..', 'niveles', 'nivel1')));
  app.use('/nivel2', requireWarmup, requireLevel(2), express.static(path.join(__dirname, '..', 'niveles', 'nivel2')));
  app.use('/nivel3', requireWarmup, requireLevel(3), express.static(path.join(__dirname, '..', 'niveles', 'nivel3')));
  app.use('/nivel4', requireWarmup, requireLevel(4), express.static(path.join(__dirname, '..', 'niveles', 'nivel4')));
  app.use('/nivel5', requireWarmup, requireLevel(5), express.static(path.join(__dirname, '..', 'niveles', 'nivel5')));

  app.use(webRouter);

  return app;
}

module.exports = {
  createApp
};
