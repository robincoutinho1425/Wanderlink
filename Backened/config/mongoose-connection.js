const mongoose = require("mongoose");
require("dotenv").config();



const dbURI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI_DEV;
console.log("Connecting to database with URI:", dbURI); // Check the URI value

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection failed:", err));

module.exports = mongoose.connection;
