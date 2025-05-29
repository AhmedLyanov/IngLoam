const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    avatar: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },    
    age: { type: String, default: "0" },
    description: { type: String },
    resume: {
      education: [{
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        startYear: { type: String, default: '' },
        endYear: { type: String, default: '' }
      }],
      experience: [{
        company: { type: String, default: '' },
        position: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        description: { type: String, default: '' }
      }],
      skills: [{ type: String, default: '' }]
    }
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;