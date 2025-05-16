const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail } = require('../mailer/mailer.js');


exports.register = async (req, res) => {
  try {
    const { name, surname, password, username, email } = req.body;

    if (!name || !surname || !password || !username || !email) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "Пользователь с таким логином или email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
    });


    await sendConfirmationEmail(email, username);

    res.status(201).json({ message: "Пользователь создан, письмо отправлено", userId: user._id });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ error: "Ошибка регистрации" });
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


exports.setPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    res.status(200).json({message:"Вход совершен", token})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Ошибка сервера" });
  }
};


