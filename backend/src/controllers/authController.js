const AuthService = require("../services/authService");
const userService = require("../services/userService"); // Проверь путь!

// Функция для парсинга кук (выносим отдельно)
function parseCookies(cookieHeader) {
    return cookieHeader?.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
        return cookies;
    }, {}) || {};
}

const AuthController = {
  // Регистрация пользователя
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

  // Логин пользователя
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.login(username, password);

      // Устанавливаем куки с ID пользователя
      res.writeHead(200, {
        "Set-Cookie": `user_id=${user.id}; HttpOnly; Max-Age=86400; Path=/; SameSite=Lax`,
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify({ message: "Вход выполнен", user }));
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  },

  // Логаут (удаление куки)
  logout(req, res) {
    res.writeHead(200, {
      "Set-Cookie": "user_id=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax", // Удаляем cookie
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ message: "Вы вышли из системы" }));
  },

  // Получение данных о пользователе
  async getUserDataController(req, res) {
    const cookies = parseCookies(req.headers.cookie); // 👈 Парсим куки вручную
    console.log("Cookies:", cookies); // 👈 Проверяем, есть ли user_id

    const userId = cookies.user_id; // Получаем user_id

    if (!userId) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Пользователь не авторизован" }));
    }

    try {
        const user = await userService.getUserById(userId);

        if (!user) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Пользователь не найден" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Ошибка сервера" }));
    }
  },
};

module.exports = AuthController;
