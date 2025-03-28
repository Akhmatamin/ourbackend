const AuthService = require("../services/authService");
const tokenService = require("../services/tokenService");
const userModel = require("../models/userModel");
const parseCookies = require("../utils/cookieParser");

const AuthController = {
  // ✅ Регистрация
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.register(username, password);
      const { password: _, ...userData } = user;

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Пользователь зарегистрирован", user: userData }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  // ✅ Логин
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.login(username, password);
      const { password: _, ...userData } = user;

      const token = await tokenService.generate(user.id); // ← сессионный токен

      res.writeHead(200, {
        "Set-Cookie": `token=${token}; HttpOnly; Max-Age=86400; Path=/; SameSite=Lax`,
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify({ message: "Вход выполнен", user: userData }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  // ✅ Логаут
  async logout(req, res) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies?.token;

    if (token) {
      await tokenService.delete(token); // удаляем токен из БД
    }

    res.writeHead(200, {
      "Set-Cookie": "token=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax",
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({ message: "Вы вышли из системы" }));
  },

  // ✅ Получить текущего пользователя (для фронта)
  async getCurrentUser(req, res) {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies?.token;

    if (!token) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Не авторизован" }));
    }

    try {
      const userId = await tokenService.findUserIdByToken(token);

      if (!userId) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Сессия недействительна" }));
      }

      const user = await userModel.findUserById(userId);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Пользователь не найден" }));
      }

      const { password: _, ...userData } = user;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ username: userData.username }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ошибка сервера" }));
    }
  },
};

module.exports = AuthController;
