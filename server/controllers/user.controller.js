const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, surname, password, username } = req.body;
    if (!name || !surname || !password || !username) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }
    const validUser = await User.findOne({ username });
    if (validUser) {
      return res.status(409).json({ error: "Пользователь уже существует" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      surname,
      username,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Пользователь создан", userId: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ error: "Пользователя нет" });
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ error: "Неверный пароль" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      "i3hduejm38",
      { expiresIn: "1h" }
    );
    res.status(200).json({message:"Вход совершен", token})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const plainUsers = users.map((user) => user.toObject());
    res.json(plainUsers);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Не удалось вывести польщователей" });
  }
};
