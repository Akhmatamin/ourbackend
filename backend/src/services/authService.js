const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");

const AuthService = {
  async register(username, password) {
    const existingUser = await UserModel.findUserByUsername(username);
    if (existingUser) throw new Error("Пользователь уже существует");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser(username, hashedPassword);

    const { password: _, ...userData } = user;
    return userData;
  },

  async login(username, password) {
    const user = await UserModel.findUserByUsername(username);
    if (!user) throw new Error("Неверные учетные данные");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Неверные учетные данные");

    const { password: _, ...userData } = user;
    return userData;
  },
};

module.exports = AuthService;
