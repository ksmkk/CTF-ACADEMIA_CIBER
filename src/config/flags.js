const CTF_FLAGS = {
  1: 'ACADEMIA{csrf_cambio_sin_consentimiento}',
  2: 'ACADEMIA{login_sin_rate_limit}',
  3: 'ACADEMIA{sqli_union_supero_control}',
  4: 'ACADEMIA{xss_dom_controlado}',
  5: 'ACADEMIA{idor_repeater_master}'
};

const WARMUP_FLAGS = {
  1: 'WARMUP{csrf_fundamentos_a}',
  2: 'WARMUP{csrf_fundamentos_b}',
  3: 'WARMUP{login_debil_a}',
  4: 'WARMUP{login_debil_b}',
  5: 'WARMUP{sqli_no_trivial_a}',
  6: 'WARMUP{sqli_no_trivial_b}',
  7: 'WARMUP{xss_contexto_a}',
  8: 'WARMUP{xss_contexto_b}',
  9: 'WARMUP{idor_burpsuite_a}',
  10: 'WARMUP{idor_burpsuite_b}'
};

module.exports = {
  CTF_FLAGS,
  WARMUP_FLAGS
};
