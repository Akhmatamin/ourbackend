const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");

const AuthService = {
  async register(username, password) {
    // Проверка на существование пользователя
    const existingUser = await UserModel.findUserByUsername(username);
    if (existingUser) throw new Error("Пользователь уже существует");

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя с хешированным паролем
    return UserModel.createUser(username, hashedPassword);
  },

  async login(username, password) {
    // Поиск пользователя по имени
    const user = await UserModel.findUserByUsername(username);
    if (!user) throw new Error("Неверные учетные данные");

    // Сравнение пароля с хешом в базе данных
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Неверные учетные данные");

    return user;
  },
};

module.exports = AuthService;
