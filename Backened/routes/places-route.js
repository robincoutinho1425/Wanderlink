const express = require("express");
const app = express();
app.use(express.json());
const Route = express.Router();
const { check } = require("express-validator");
const authCheck = require("../middlewares/authCheck");
const placesController = require("../controllers/places-controller");
const fileUpload = require("../middlewares/fileUpload");

// Public routes (no auth required)
Route.get("/search", placesController.searchPlaces);
Route.get("/:pid", placesController.getPlacesByPId);
Route.get("/user/:uid", placesController.getPlacesByUid);
Route.get("/", placesController.getAllPlaces);
// Apply authCheck middleware for all routes below this
Route.use(authCheck);
Route.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesController.createNewPlace
);

// Rating routes
Route.get("/:pid/userrating", placesController.getUserRating); // Get user's rating
Route.post("/:pid/rate", placesController.RateThePlace); // Set/update rating
// Comment routes
Route.post("/:pid/comments", placesController.addComment);
Route.get("/:pid/comments", placesController.getComments);
Route.delete("/:pid/comments/:commentId", placesController.deleteComment);
// Other protected routes
Route.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesController.updatePlacesByPId
);
Route.delete("/:pid", placesController.deletePlaceByPId);

module.exports = Route;
