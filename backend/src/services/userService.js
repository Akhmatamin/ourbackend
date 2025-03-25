const pool = require("../database"); // Проверь путь к базе!

const userService = {
  async getUserById(userId) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    return result.rows[0]; // Возвращаем пользователя или undefined, если нет
  }
};

module.exports = userService;
