require("dotenv").config();
const express = require("express");
const placesRouter = require("./routes/places-route");
const app = express();
const fs = require("fs");
const path = require("path");
const db = require("./config/mongoose-connection");
const userRouter = require("./routes/user-routes");
const cors = require("cors");
const httpError = require("./models/errorModel");
app.use(
  cors({
    origin: ["https://yourplaces-frontened.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use("/public/images/", express.static(path.join("public", "images")));
app.use("/api/places", placesRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  throw new httpError(404, "Page Not Found");
});
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  }

  if (res.headersSent) {
    return next(error);
  }
  res.status(error.statusCode || 500).json({
    message: error.message || "An unknown error occurred.",
  });
});
app.listen(5000);
