const PORT = Number(process.env.PORT) || 3000;
const SECRET = process.env.CTF_SECRET || 'academia-lab-local-2026';
const TOTAL_LEVELS = 5;
const WARMUP_TOTAL_LEVELS = 10;

module.exports = {
  PORT,
  SECRET,
  TOTAL_LEVELS,
  WARMUP_TOTAL_LEVELS
};
