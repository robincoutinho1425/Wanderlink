const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userName: {
      type: String,
      unique: true,
      maxlength: 10,
      required: true, // Ensure it's required
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 5 },
    image: { type: String },
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", userSchema);
