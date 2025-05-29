const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

const CodeSnippetSchema = mongoose.Schema({
  language: { type: String, required: true },
  code: { type: String, required: true },
});

const PostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
   images: [{ type: String, default: "" }],
    codeSnippets: [CodeSnippetSchema],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    comments: [CommentSchema],
    answersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", PostSchema);
module.exports = Post;