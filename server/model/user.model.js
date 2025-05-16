const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: {type: String, unique: true, required: true},
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},    
    age: {type: String, default: "0" },
    description: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
