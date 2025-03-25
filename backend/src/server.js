const http = require("http");
const url = require("url");
const cookieParser = require("cookie-parser");
const AuthController = require("./controllers/authController");
const { validateRegister } = require("./middlewares/validationMiddleware");

const parseCookies = (req) => {
  const cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach(cookie => {
      const [name, value] = cookie.split("=").map(c => c.trim());
      cookies[name] = decodeURIComponent(value);
    });
  }
  return cookies;
};

const server = http.createServer((req, res) => {
  // Добавляем CORS заголовки в ответ
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Разрешаем доступ с фронтенда
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Обрабатываем preflight-запросы (OPTIONS)
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  req.cookies = parseCookies(req); // Разбираем куки вручную
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  console.log(`Запрос: ${req.url} Метод: ${method}`);
  let body = "";

  req.on("data", chunk => body += chunk);

  req.on("end", () => {
    try {
      req.body = body ? JSON.parse(body) : {}; // Обрабатываем пустой body
    } catch (error) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Invalid JSON" }));
    }

    console.log(`Запрос: ${req.url} Метод: ${method}`);

    // Маршруты
    if (parsedUrl.pathname === "/api/auth/signup" && method === "POST") {
      console.log("Получен запрос для регистрации");

      validateRegister(req, res, () => {
        AuthController.register(req, res);
      });

    } else if (parsedUrl.pathname === "/api/auth/login" && method === "POST") {
      console.log("Получен запрос для логина");
      AuthController.login(req, res);

    } else if (parsedUrl.pathname === "/api/auth/logout" && method === "POST") {
      console.log("Получен запрос для логаута");
      AuthController.logout(req, res);

    } else if (parsedUrl.pathname === "/api/auth/status" && method === "GET") {
      console.log("Запрос на статус");
      AuthController.getUserDataController(req, res);

    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Маршрут не найден" }));
      console.log("Маршрут не найден:", parsedUrl.pathname);
    }
  });
});

server.listen(5000, () => {
  console.log("Сервер работает на порту 5000");
});
