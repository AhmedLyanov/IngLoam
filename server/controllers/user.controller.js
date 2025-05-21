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
      resume: {
        education: [],
        experience: [],
        skills: []
      }
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
    res.status(200).json({ message: "Вход совершен", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    user.avatar = `http://localhost:3000/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Аватарка загружена', avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки аватара' });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { education, experience, skills } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    user.resume = { education, experience, skills };
    await user.save();

    res.json({ message: 'Резюме обновлено', resume: user.resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка обновления резюме' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    user.resume = { education: [], experience: [], skills: [] };
    await user.save();

    res.json({ message: 'Резюме удалено' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления резюме' });
  }
};