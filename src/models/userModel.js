const pool = require("../database");

const UserModel = {
  async createUser(username, hashedPassword) {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    return result.rows[0];
  },

  async findUserByUsername(username) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0];
  },

  async findUserById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },
};

module.exports = UserModel;
