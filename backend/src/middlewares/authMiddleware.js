const pool = require("../database");

const authMiddleware = async (req, res, next) => {
  const userId = req.cookies.user_id;

  if (!userId) {
    return res.status(401).json({ error: "Необходима авторизация" });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (!user.rows[0]) {
      return res.status(401).json({ error: "Пользователь не найден" });
    }

    req.user = user.rows[0]; // Добавляем информацию о пользователе в запрос
    next();
  } catch (error) {
    return res.status(500).json({ error: "Ошибка при проверке авторизации" });
  }
};

module.exports = authMiddleware;
