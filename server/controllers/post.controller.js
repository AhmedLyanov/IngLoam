const Post = require("../model/post.model.js");
const User = require("../model/user.model.js");

exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      author: req.userId,
      image: req.file ? `http://localhost:3000/uploads/${req.file.filename}` : "",
    });

    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Server error" });
  }
};