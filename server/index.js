const express = require("express");
const mongoose = require("mongoose");
const userController = require('./controllers/user.controller');
const { authenticate } = require('./middleware/auth.middleware'); 
const User = require("./model/user.model")
const cors = require("cors");
const app = express();
app.use(cors()); 
app.use(express.json());


app.get('/', (req, res) => res.json({ message: 'Успешное подключение' }));
app.post("/register", userController.register);
app.post("/login", userController.login); 
app.get("/profile", authenticate, async  (req, res) => {
  const profile = await User.findById( req.userId)
  res.json({ message: "Доступ разрешён!", profile, });
});


mongoose.connect("mongodb://localhost:27017/practic")
  .then(() => app.listen(3000, () => console.log("Сервер запущен!")))
  .catch(err => console.error("Ошибка MongoDB:", err));