const http = require("http");
const url = require("url");
const { parse } = require("querystring");
const parseCookies = require("./utils/cookieParser");
const AuthController = require("./controllers/authController");
const { validateRegister } = require("./middlewares/validationMiddleware");
const { handleError } = require("./middlewares/errorHandler");

const server = http.createServer(async (req, res) => {
  // Заголовки
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin","http://localhost:5500");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Парсим куки
  req.cookies = parseCookies(req.headers.cookie);

  // Парсим URL и тело запроса
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  let body = "";

  req.on("data", chunk => body += chunk);
  req.on("end", async () => {
    try {
      if (body) req.body = JSON.parse(body);
    } catch (err) {
      return handleError(res, 400, "Невалидный JSON");
    }

    try {
      // Роутинг
      if (parsedUrl.pathname === "/api/auth/signup" && method === "POST") {
        validateRegister(req, res, async () => {
          await AuthController.register(req, res);
        });
      } else if (parsedUrl.pathname === "/api/auth/login" && method === "POST") {
        await AuthController.login(req, res);
      } else if (parsedUrl.pathname === "/api/auth/logout" && method === "POST") {
        AuthController.logout(req, res);
      }else if (parsedUrl.pathname === "/api/auth/me" && method === "GET") {
        await AuthController.getCurrentUser(req, res);
      }else {
        handleError(res, 404, "Маршрут не найден");
      }
    } catch (err) {
      handleError(res, 500, err.message);
    }
  });
});

server.listen(5000, () => {
  console.log("Сервер работает на порту 5000");
});
