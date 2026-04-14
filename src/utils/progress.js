const crypto = require('crypto');
const { SECRET, TOTAL_LEVELS, WARMUP_TOTAL_LEVELS } = require('../config');
const { parseCookies } = require('./cookies');

function sign(scope, level) {
  return crypto.createHmac('sha256', SECRET).update(`${scope}:${String(level)}`).digest('hex').slice(0, 16);
}

function appendCookie(res, cookie) {
  const existing = res.getHeader('Set-Cookie');
  if (!existing) {
    res.setHeader('Set-Cookie', cookie);
    return;
  }

  const values = Array.isArray(existing) ? existing : [existing];
  values.push(cookie);
  res.setHeader('Set-Cookie', values);
}

function readSignedProgress(req, cookieName, scope, maxLevel) {
  const cookies = parseCookies(req.headers.cookie);
  const raw = cookies[cookieName];

  if (!raw) return 1;

  const [levelRaw, signature] = raw.split('.');
  const level = Number(levelRaw);

  if (!Number.isInteger(level) || level < 1 || level > maxLevel) return 1;
  if (signature !== sign(scope, level)) return 1;

  return level;
}

function writeSignedProgress(res, cookieName, scope, maxLevel, level) {
  const safeLevel = Math.max(1, Math.min(maxLevel, Number(level) || 1));
  const value = `${safeLevel}.${sign(scope, safeLevel)}`;
  appendCookie(res, `${cookieName}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax`);
}

function getUnlockedLevel(req) {
  return readSignedProgress(req, 'ctf_progress', 'ctf', TOTAL_LEVELS);
}

function setUnlockedLevel(res, level) {
  writeSignedProgress(res, 'ctf_progress', 'ctf', TOTAL_LEVELS, level);
}

function getWarmupUnlockedLevel(req) {
  return readSignedProgress(req, 'warmup_progress', 'warmup', WARMUP_TOTAL_LEVELS + 1);
}

function setWarmupUnlockedLevel(res, level) {
  writeSignedProgress(res, 'warmup_progress', 'warmup', WARMUP_TOTAL_LEVELS + 1, level);
}

function isWarmupCompleted(req) {
  return getWarmupUnlockedLevel(req) > WARMUP_TOTAL_LEVELS;
}

module.exports = {
  getUnlockedLevel,
  setUnlockedLevel,
  getWarmupUnlockedLevel,
  setWarmupUnlockedLevel,
  isWarmupCompleted
};
