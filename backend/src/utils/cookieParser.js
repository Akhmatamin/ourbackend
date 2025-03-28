module.exports = function parseCookies(cookieHeader = '') {
    return cookieHeader
      .split(';')
      .filter(Boolean)
      .map(cookie => cookie.trim().split('=')) // [name, value]
      .reduce((acc, [key, value]) => {
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
  };
  