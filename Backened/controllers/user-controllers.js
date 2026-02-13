const { validationResult } = require("express-validator");
const httpError = require("../models/errorModel");
const model = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
  try {
    const allUsers = await model.find({}, "-password").populate("places");
    return res.status(200).json({ users: allUsers });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};
const userLogin = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const { email, password } = req.body;
  try {
    const user = await model.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY
    );
    return res.status(200).json({ userId: user._id, email: user.email, token });
  } catch (err) {
    return res.status(500).json({ message: "Login failed, please try again" });
  }
};

const hasUsers = async (req, res) => {
  try {
    const userCount = await model.find({});

    res.status(200).json({ hasUsers: userCount.length > 0 });
  } catch (err) {
    res.status(500).json({ message: "Fetching user data failed." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id, email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset Link",
      text: `http://localhost:5173/reset-password/${user._id}/${token}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Password reset link sent" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to process password reset request" });
  }
};

const resetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const password = req.body.newPassword;
  const user = await model.findOne({ _id: id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isTokenValid = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!isTokenValid) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  bcrypt
    .hashSync(password, 12)
    .then(async (hash) => {
      const updatedUser = await model.findOneAndUpdate(
        { _id: id },
        { password: hash },
        { new: true }
      );
      return res.status(200).json({ message: "Password updated successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Password reset failed" });
    });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await model.findById(userId, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Fetching user failed" });
  }
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Find user and update
    const user = await model.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;

    if (req.file) {
      user.image = req.file.path; // Update image path
    }

    await user.save();

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Updating user failed" });
  }
};

const userSignUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, userName } = req.body;

    // Check for an existing user within the transaction
    const existingUser = await model.findOne({ email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User already exists" });
    }

    // Hash the password
    const hash = bcrypt.hashSync(password, 12);

    // Create the user with the session
    const user = await model.create(
      [
        {
          name,
          userName,
          email,
          password: hash,
          places: [],
          image: req.file.path,
        },
      ],
      { session }
    );

    // Access the created user's ID (user[0] since `create` returns an array)
    const createdUser = user[0];

    // Generate a token
    const token = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      process.env.JWT_SECRET_KEY
    );

    await session.commitTransaction();
    session.endSession();

    // Return the userId and token
    res.status(201).json({
      userId: createdUser._id, // Fix: Use createdUser._id instead of user._id
      email: createdUser.email,
      token: token,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: "Signup failed" });
  }
};

exports.getUsers = getUsers;
exports.userLogin = userLogin;
exports.userSignUp = userSignUp;
exports.hasUsers = hasUsers;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
