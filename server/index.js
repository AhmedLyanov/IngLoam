const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const multer = require('multer');
const userController = require('./controllers/user.controller');
const { authenticate } = require('./middleware/auth.middleware'); 
const User = require("./model/user.model")
const cors = require("cors");
const app = express();
app.use(cors()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => res.json({ message: 'Успешное подключение' }));
app.post("/register", userController.register);
app.post("/login", userController.login); 
app.post('/upload-avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);
app.get("/profile", authenticate, async  (req, res) => {
  const profile = await User.findById( req.userId)
  res.json({ message: "Доступ разрешён!", profile, });
});


mongoose.connect("mongodb://localhost:27017/practic")
  .then(() => app.listen(3000, () => console.log("Сервер запущен!")))
  .catch(err => console.error("Ошибка MongoDB:", err));