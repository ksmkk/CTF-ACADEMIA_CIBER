const { PORT } = require('./config');
const { createApp } = require('./app');

const app = createApp();

app.listen(PORT, () => {
  console.log(`CTF levantado en http://localhost:${PORT}`);
});
