const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
app.use(express.json());
const Route = express.Router();
const userController = require("../controllers/user-controllers");
const fileUpload = require("../middlewares/fileUpload");
const authCheck = require("../middlewares/authCheck");
Route.get("/", userController.getUsers);
Route.patch(
  "/:userId",
  authCheck,
  fileUpload.single("image"),
  [check("name").not().isEmpty().withMessage("Name is required")],
  userController.updateUser
);


Route.get("/hasUsers", userController.hasUsers);
Route.get("/:userId", userController.getUserById);


Route.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty().withMessage("Please enter your name"),
    check("password")
      .isLength({ min: 4 })
      .withMessage("Please enter your password minimum 4 characters long"),
    check("email").isEmail().withMessage("Please enter valid email address"),
  ],

  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ error: error.array() }); // Return errors to the frontend
    }
    next();
  },
  userController.userSignUp
);
// Backend routes - user-routes.js (add this route)

Route.post(
  "/forgot-password",
  [check("email").isEmail().withMessage("Please provide a valid email.")],
  userController.forgotPassword
);

Route.post("/reset-password/:id/:token", userController.resetPassword);

Route.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 4, max: 12 })],
  userController.userLogin
);

module.exports = Route;
