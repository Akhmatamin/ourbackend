const http = require("http");
const url = require("url");
const cookieParser = require("cookie-parser");
const AuthController = require("./controllers/authController");
const { validateRegister } = require("./middlewares/validationMiddleware");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Разрешаем фронтенду доступ
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Разрешаем куки
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  cookieParser()(req, res, () => {});

  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  console.log(`Запрос: ${req.url} Метод: ${method}`);

  let body = "";

  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    if (body) {
      req.body = JSON.parse(body);

      if (parsedUrl.pathname === "/api/auth/signup" && method === "POST") {
        console.log("Получен запрос для регистрации");
        validateRegister(req, res, () => {
          AuthController.register(req, res); // Вызываем контроллер для регистрации
        });

      }
       else if (parsedUrl.pathname === "/api/auth/login" && method === "POST") {
        console.log("Получен запрос для логина");
        AuthController.login(req, res); // Вызываем контроллер для логина
      } 
      else if (parsedUrl.pathname === "/api/auth/logout" && method === "POST") {
        console.log("Получен запрос для логаута");
        AuthController.logout(req, res); // Вызываем контроллер для логаута
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Маршрут не найден" }));
        console.log("Маршрут не найден для запроса:", parsedUrl.pathname);
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Сервер работает на порту 5000");
});
