const crypto = require("crypto");
const pool = require("../database");

const tokenService = {
  // 🔑 Сгенерировать токен и сохранить в БД
  async generate(userId) {
    const token = crypto.randomBytes(32).toString("hex");

    await pool.query(
      "INSERT INTO tokens (user_id, token) VALUES ($1, $2)",
      [userId, token]
    );

    return token;
  },

  // 🔍 Найти user_id по токену
  async findUserIdByToken(token) {
    const result = await pool.query(
      "SELECT user_id FROM tokens WHERE token = $1",
      [token]
    );

    return result.rows[0]?.user_id || null;
  },

  // 🗑 Удалить токен (при logout)
  async delete(token) {
    await pool.query("DELETE FROM tokens WHERE token = $1", [token]);
  }
};

module.exports = tokenService;
