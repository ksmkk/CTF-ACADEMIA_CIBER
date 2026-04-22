const CTF_FLAGS = {
  1: 'ACADEMIA{csrf_cambio_sin_consentimiento}',
  2: 'ACADEMIA{login_sin_rate_limit}',
  3: 'ACADEMIA{sqli_union_supero_control}',
  4: 'ACADEMIA{xss_dom_controlado}',
  5: 'ACADEMIA{idor_repeater_master}'
};

const WARMUP_FLAGS = {
  1: 'WARMUP{nmap_service_detection}',
  2: 'WARMUP{lfi_local_file_read}',
  3: 'WARMUP{bruteforce_common_password}',
  4: 'WARMUP{database_flag_column}',
  5: 'WARMUP{privesc_suid_bit}'
};

function getFinalValidatorFlag() {
  const codes = [
    65, 67, 65, 68, 69, 77, 73, 65, 123,
    109, 105, 115, 105, 111, 110, 95, 99, 117, 109, 112, 108, 105, 100, 97,
    95, 114, 111, 111, 116, 95, 117, 99, 110,
    125
  ];

  return String.fromCharCode(...codes);
}

module.exports = {
  CTF_FLAGS,
  WARMUP_FLAGS,
  getFinalValidatorFlag
};
