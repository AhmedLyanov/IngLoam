const Post = require("../model/post.model.js");
const User = require("../model/user.model.js");

exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, codeSnippets } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const images = req.files ? req.files.map(file => `http://localhost:3000/uploads/${file.filename}`) : [];

    const post = await Post.create({
      title,
      content,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      images,
      codeSnippets: codeSnippets ? JSON.parse(codeSnippets) : [],
      author: req.userId,
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

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags, codeSnippets } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: "You are not authorized to update this post" });
    }

    const images = req.files
      ? req.files.map(file => `http://localhost:3000/uploads/${file.filename}`)
      : req.body.images
      ? JSON.parse(req.body.images)
      : post.images;

    const updateData = {
      title,
      content,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      images,
      codeSnippets: codeSnippets ? JSON.parse(codeSnippets) : post.codeSnippets,
    };

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");
    res.status(200).json({ message: "Post updated", post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({
      content,
      author: req.userId,
    });

    post.answersCount = post.comments.length;
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");

    res.status(201).json({ message: "Comment added", post: updatedPost });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Server error" });
  }
};