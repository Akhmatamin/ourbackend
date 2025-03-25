const pool = require("../database");

const authMiddleware = async (req, res, next) => {
  // Получаем user_id из куки (если куки вообще передаются)
  const userId = req.cookies?.user_id;

  if (!userId) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Необходима авторизация" }));
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (!user.rows.length) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Пользователь не найден" }));
    }

    req.user = user.rows[0]; // Добавляем пользователя в req
    next(); // Передаём управление дальше
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Ошибка при проверке авторизации" }));
  }
};

module.exports = authMiddleware;
