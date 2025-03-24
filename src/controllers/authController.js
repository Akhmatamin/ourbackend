const AuthService = require("../services/authService");

const AuthController = {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.register(username, password);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Пользователь зарегистрирован", user }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.login(username, password);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Вход выполнен", user }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  logout(req, res) {
    res.writeHead(200, {
      "Set-Cookie": "user_id=; HttpOnly; Max-Age=0", // Удаляем cookie
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({ message: "Вы вышли из системы" }));
  }
};

module.exports = AuthController;
