const http = require("http");
const url = require("url");
const cookieParser = require("cookie-parser");
const AuthController = require("./controllers/authController");
const { validateRegister } = require("./middlewares/validationMiddleware");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  cookieParser()(req, res, () => {});

  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  // Логирование запроса
  console.log(`Запрос: ${req.url} Метод: ${method}`);

  // Маршрут для регистрации
  if (parsedUrl.pathname === "/api/auth/register" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      req.body = JSON.parse(body);

      // Применяем валидацию перед регистрацией
      validateRegister(req, res, () => {
        AuthController.register(req, res); // Вызываем контроллер для регистрации
      });
    });
    console.log("Получен запрос для регистрации");

  } 
  // Маршрут для логина
  else if (parsedUrl.pathname === "/api/auth/login" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      req.body = JSON.parse(body);
      AuthController.login(req, res); // Вызываем контроллер для логина
      console.log("Получен запрос для логина");

    });
  } 
  // Маршрут для логаута
  else if (parsedUrl.pathname === "/api/auth/logout" && method === "POST") {
    AuthController.logout(req, res); // Вызываем контроллер для логаута
    console.log("Получен запрос для логаута");

  } 
  // Если маршрут не найден
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Маршрут не найден" }));
    console.log("Маршрут не найден для запроса:", parsedUrl.pathname);
  }
});

server.listen(5000, () => {
  console.log("Сервер работает на порту 5000");
});
