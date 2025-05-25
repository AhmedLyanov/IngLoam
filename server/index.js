const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const multer = require('multer');
const userController = require('./controllers/user.controller');
const postController = require('./controllers/post.controller');
const { authenticate } = require('./middleware/auth.middleware');
const User = require("./model/user.model");
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
app.get("/profile", authenticate, async (req, res) => {
  const profile = await User.findById(req.userId);
  res.json({ message: "Доступ разрешён!", profile });
});
app.delete('/posts/:id', authenticate, postController.deletePost);
app.get('/posts/:id', postController.getPostById);
app.put('/posts/:id', authenticate, upload.array('images', 5), postController.updatePost);
app.post('/posts', authenticate, upload.array('images', 5), postController.createPost); 
app.get('/posts', postController.getPosts);
app.post('/posts/:id/comments', authenticate, postController.addComment); 
app.post('/update-resume', authenticate, userController.updateResume);
app.delete('/delete-resume', authenticate, userController.deleteResume); 

mongoose.connect("mongodb://localhost:27017/practic")
  .then(() => app.listen(3000, () => console.log("Сервер запущен!")))
  .catch(err => console.error("Ошибка MongoDB:", err));