const { PORT } = require('./config');
const { createApp } = require('./app');

const app = createApp();

app.listen(PORT, () => {
  console.log(`Warmup levantado en http://localhost:${PORT}`);
});
