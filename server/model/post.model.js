const mongoose = require("mongoose");
const PostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    keywords: { type: [String], default: [] },
    author: {type: String, required:true}
  },
  { timestamps: true }
);
const Post = mongoose.model("post", PostSchema);
module.exports = Post;