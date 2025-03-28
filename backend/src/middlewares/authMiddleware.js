const pool = require("../database");
const parseCookies = require("../utils/cookieParser");

const authMiddleware = async (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  const userId = cookies?.user_id;

  if (!userId) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Необходима авторизация" }));
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (!result.rows.length) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Пользователь не найден" }));
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Ошибка при проверке авторизации" }));
  }
};

module.exports = authMiddleware;
