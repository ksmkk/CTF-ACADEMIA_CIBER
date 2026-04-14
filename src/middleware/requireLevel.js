const { getUnlockedLevel } = require('../utils/progress');

function requireLevel(level) {
  return (req, res, next) => {
    const unlocked = getUnlockedLevel(req);
    if (unlocked >= level) return next();

    return res.status(403).send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Acceso bloqueado</title>
  <link rel="stylesheet" href="/public/styles.css" />
</head>
<body>
  <main class="container">
    <h1>Acceso bloqueado</h1>
    <div class="box warning">
      <p>Ese nivel aun no esta desbloqueado.</p>
      <p>Debes completar primero los niveles anteriores y validar su flag.</p>
      <p>Tu progreso actual llega hasta: <strong>nivel ${unlocked}</strong>.</p>
      <p>Vuelve a: <a href="/nivel${unlocked}/">/nivel${unlocked}/</a></p>
    </div>
    <p><a href="/">Ir al inicio</a></p>
  </main>
</body>
</html>`);
  };
}

module.exports = {
  requireLevel
};
