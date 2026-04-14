const path = require('path');
const express = require('express');
const { TOTAL_LEVELS, WARMUP_TOTAL_LEVELS } = require('../config');
const { CTF_FLAGS, WARMUP_FLAGS } = require('../config/flags');
const { WARMUP_SECTIONS } = require('../config/warmup');
const {
  getUnlockedLevel,
  setUnlockedLevel,
  getWarmupUnlockedLevel,
  setWarmupUnlockedLevel,
  isWarmupCompleted
} = require('../utils/progress');

const router = express.Router();

function getWarmupSectionBySlug(slug) {
  return WARMUP_SECTIONS.find((section) => section.slug === slug);
}

function getWarmupSectionByLevel(level) {
  return WARMUP_SECTIONS.find((section) => section.levels.some((entry) => entry.id === level));
}

function canAccessLevel(req, level) {
  if (!isWarmupCompleted(req)) return false;
  return getUnlockedLevel(req) >= level;
}

function sendForbiddenJson(res) {
  return res.status(403).json({ ok: false, message: 'Nivel no disponible.' });
}

function normalizeAnswer(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function canAccessWarmupLevel(req, level) {
  const unlocked = getWarmupUnlockedLevel(req);
  if (unlocked > WARMUP_TOTAL_LEVELS) return true;
  return unlocked >= level;
}

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'home.html'));
});

router.get('/api/progreso', (req, res) => {
  if (!isWarmupCompleted(req)) {
    return res.json({
      unlocked: 0,
      total: TOTAL_LEVELS,
      warmupCompleted: false
    });
  }

  const unlocked = getUnlockedLevel(req);
  res.json({ unlocked, total: TOTAL_LEVELS, warmupCompleted: true });
});

router.get('/warmup/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'warmup.html'));
});

router.get('/warmup/:section/', (req, res) => {
  const section = getWarmupSectionBySlug(req.params.section);
  if (!section) return res.status(404).redirect('/warmup/');

  return res.sendFile(path.join(__dirname, '..', '..', 'views', 'warmup-section.html'));
});

router.get('/api/warmup', (req, res) => {
  const unlocked = getWarmupUnlockedLevel(req);
  const completed = unlocked > WARMUP_TOTAL_LEVELS;
  res.json({
    unlocked,
    total: WARMUP_TOTAL_LEVELS,
    completed
  });
});

router.get('/api/warmup/sections', (req, res) => {
  const unlocked = getWarmupUnlockedLevel(req);
  const completed = unlocked > WARMUP_TOTAL_LEVELS;

  const sections = WARMUP_SECTIONS.map((section) => {
    const start = section.levels[0].id;
    const end = section.levels[1].id;
    const available = completed || unlocked >= start;
    const sectionCompleted = completed || unlocked > end;

    return {
      slug: section.slug,
      title: section.title,
      levels: section.levels.map((level) => level.id),
      available,
      completed: sectionCompleted
    };
  });

  res.json({
    unlocked,
    total: WARMUP_TOTAL_LEVELS,
    completed,
    sections
  });
});

router.get('/api/warmup/section/:slug', (req, res) => {
  const section = getWarmupSectionBySlug(req.params.slug);
  if (!section) return res.status(404).json({ ok: false, message: 'Seccion no encontrada.' });

  const unlocked = getWarmupUnlockedLevel(req);
  const completed = unlocked > WARMUP_TOTAL_LEVELS;

  const levels = section.levels.map((level) => {
    const locked = !completed && level.id > unlocked;
    const done = completed || level.id < unlocked;

    return {
      id: level.id,
      title: level.title || `Warm-up ${level.id}`,
      objective: level.objective || 'Resuelve este mini reto y valida la flag.',
      open: level.open || 'Lee la tarjeta actual.',
      observe: level.observe || 'Identifica la idea principal del reto.',
      deliver: level.deliver || 'Responde el mini ejercicio y valida la flag.',
      challenge: level.challenge || 'Responde una palabra clave sobre este tema.',
      sampleAnswer: level.sampleAnswer || 'revisa pistas',
      steps: Array.isArray(level.steps) ? level.steps : [],
      hints: Array.isArray(level.hints) ? level.hints : [],
      status: locked ? 'Bloqueado' : (done ? 'Completado' : 'Disponible'),
      locked
    };
  });

  return res.json({
    ok: true,
    section: {
      slug: section.slug,
      title: section.title,
      intro: section.intro,
      levels
    }
  });
});

router.post('/api/warmup/solve', (req, res) => {
  const levelId = Number(req.body.levelId);
  const answerRaw = String(req.body.answer || '');

  if (!Number.isInteger(levelId) || levelId < 1 || levelId > WARMUP_TOTAL_LEVELS) {
    return res.status(400).json({ ok: false, message: 'Nivel de warm-up invalido.' });
  }

  if (!canAccessWarmupLevel(req, levelId)) {
    return res.status(403).json({ ok: false, message: 'Ese warm-up aun no esta desbloqueado.' });
  }

  const section = getWarmupSectionByLevel(levelId);
  if (!section) {
    return res.status(404).json({ ok: false, message: 'No se encontro el warm-up solicitado.' });
  }

  const level = section.levels.find((entry) => entry.id === levelId);
  if (!level) {
    return res.status(404).json({ ok: false, message: 'No se encontro el nivel solicitado.' });
  }

  const expected = normalizeAnswer(level.answer);
  const provided = normalizeAnswer(answerRaw);
  if (!provided || provided !== expected) {
    return res.json({ ok: true, solved: false, message: 'Respuesta incorrecta. Revisa la guia rapida y las pistas.' });
  }

  return res.json({
    ok: true,
    solved: true,
    flag: WARMUP_FLAGS[levelId],
    message: 'Respuesta correcta. Esta es tu flag warm-up:'
  });
});

router.post('/warmup/validar', (req, res) => {
  const nivel = Number(req.body.nivel);
  const flag = String(req.body.flag || '').trim();
  const unlocked = getWarmupUnlockedLevel(req);
  const section = getWarmupSectionByLevel(nivel);

  if (!Number.isInteger(nivel) || nivel < 1 || nivel > WARMUP_TOTAL_LEVELS) {
    return res.redirect('/warmup/');
  }

  if (unlocked <= WARMUP_TOTAL_LEVELS && unlocked < nivel) {
    if (!section) return res.redirect('/warmup/?error=locked');
    return res.redirect(`/warmup/${section.slug}/?error=locked`);
  }

  if (flag !== WARMUP_FLAGS[nivel]) {
    if (!section) return res.redirect(`/warmup/?error=1&nivel=${nivel}`);
    return res.redirect(`/warmup/${section.slug}/?error=1&nivel=${nivel}`);
  }

  const nextUnlocked = Math.max(unlocked, nivel + 1);
  setWarmupUnlockedLevel(res, nextUnlocked);

  if (nextUnlocked > WARMUP_TOTAL_LEVELS) {
    setUnlockedLevel(res, 1);
    return res.redirect('/?warmup=done');
  }

  const nextSection = getWarmupSectionByLevel(nextUnlocked);
  if (nextSection) return res.redirect(`/warmup/${nextSection.slug}/`);
  return res.redirect('/warmup/');
});

router.post('/api/ctf/nivel1/transfer', (req, res) => {
  if (!canAccessLevel(req, 1)) return sendForbiddenJson(res);

  const to = String(req.body.to || '').trim();
  const amount = String(req.body.amount || '').trim();
  const origin = String(req.body.origin || 'self').trim();

  if (to === 'cuenta_atacante' && amount === '50000' && origin === 'evil') {
    return res.json({ ok: true, solved: true, flag: CTF_FLAGS[1], message: 'Transferencia no autorizada detectada.' });
  }

  return res.json({ ok: true, solved: false, message: `Transferencia enviada a ${to} por $${amount}.` });
});

router.post('/api/ctf/nivel2/pin', (req, res) => {
  if (!canAccessLevel(req, 2)) return sendForbiddenJson(res);

  const pin = String(req.body.pin || '').trim();
  if (pin === '0000') {
    return res.json({ ok: true, solved: true, flag: CTF_FLAGS[2], message: 'Acceso concedido.' });
  }

  return res.json({ ok: true, solved: false, message: 'PIN incorrecto. Revisa los recursos del nivel.' });
});

router.post('/api/ctf/nivel3/sqli', (req, res) => {
  if (!canAccessLevel(req, 3)) return sendForbiddenJson(res);

  const email = String(req.body.email || '').toLowerCase();
  const password = String(req.body.password || '').toLowerCase();
  const payload = `${email} ${password}`;

  const looksLikeAdvancedSqli =
    payload.includes('union select') ||
    payload.includes('sleep(') ||
    payload.includes('waitfor delay') ||
    payload.includes('extractvalue(') ||
    payload.includes('information_schema') ||
    (payload.includes('--') && payload.includes("'"));

  if (looksLikeAdvancedSqli) {
    return res.json({ ok: true, solved: true, flag: CTF_FLAGS[3], message: 'Bypass SQLi exitoso.' });
  }

  return res.json({ ok: true, solved: false, message: 'Acceso denegado. Prueba un payload SQLi no trivial.' });
});

router.post('/api/ctf/nivel4/xss-check', (req, res) => {
  if (!canAccessLevel(req, 4)) return sendForbiddenJson(res);

  const executed = String(req.body.executed || '').trim();
  if (executed === 'true') {
    return res.json({ ok: true, solved: true, flag: CTF_FLAGS[4], message: 'XSS verificado.' });
  }

  return res.json({ ok: true, solved: false, message: 'No se detecto ejecucion XSS aun.' });
});

router.get('/api/ctf/nivel5/orders', (req, res) => {
  if (!canAccessLevel(req, 5)) return sendForbiddenJson(res);

  const orders = {
    1001: { owner: 'alumno.demo', total: '$14.990', status: 'Pagada', note: 'Sin datos sensibles' },
    1002: { owner: 'profesor.lab', total: '$29.990', status: 'Pendiente', note: 'Sin datos sensibles' },
    1337: { owner: 'admin.root', total: '$0', status: 'Interna', note: `Referencia interna: ${CTF_FLAGS[5]}` }
  };

  const orderId = Number(req.query.orderId || 1001);
  const order = orders[orderId] || orders[1001];

  return res.json({ ok: true, orderId, order });
});

router.post('/validar', (req, res) => {
  if (!isWarmupCompleted(req)) {
    return res.redirect('/warmup/');
  }

  const nivel = Number(req.body.nivel);
  const flag = String(req.body.flag || '').trim();
  const unlocked = getUnlockedLevel(req);

  if (!Number.isInteger(nivel) || nivel < 1 || nivel > TOTAL_LEVELS) {
    return res.redirect('/');
  }

  if (unlocked < nivel) {
    return res.redirect(`/nivel${unlocked}/`);
  }

  if (flag !== CTF_FLAGS[nivel]) {
    return res.redirect(`/nivel${nivel}/?error=1`);
  }

  const nextUnlocked = Math.max(unlocked, Math.min(TOTAL_LEVELS, nivel + 1));
  setUnlockedLevel(res, nextUnlocked);

  if (nivel === TOTAL_LEVELS) {
    return res.redirect('/?final=1');
  }

  return res.redirect(`/nivel${nivel + 1}/`);
});

router.post('/reiniciar', (_req, res) => {
  setUnlockedLevel(res, 1);
  setWarmupUnlockedLevel(res, 1);
  res.redirect('/');
});

module.exports = {
  webRouter: router
};
