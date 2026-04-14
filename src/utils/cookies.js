function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) return acc;

    const eq = trimmed.indexOf('=');
    if (eq === -1) return acc;

    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

module.exports = {
  parseCookies
};
