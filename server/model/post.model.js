const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    image: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    answersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", PostSchema);
module.exports = Post;