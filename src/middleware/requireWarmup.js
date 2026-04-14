const { isWarmupCompleted } = require('../utils/progress');

function requireWarmup(req, res, next) {
  if (isWarmupCompleted(req)) return next();

  return res.status(403).send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Warm-up pendiente</title>
  <link rel="stylesheet" href="/public/styles.css" />
</head>
<body>
  <main class="container">
    <h1>Warm-up pendiente</h1>
    <div class="box warning">
      <p>Antes de iniciar el CTF principal debes completar los Warm-up Challenges.</p>
      <p>Esta fase incluye 10 mini-retos, dos por cada vulnerabilidad que veran en el laboratorio final.</p>
      <p><a class="btn" href="/warmup/">Ir a Warm-up Challenges</a></p>
    </div>
    <p><a href="/">Volver al inicio</a></p>
  </main>
</body>
</html>`);
}

module.exports = {
  requireWarmup
};
