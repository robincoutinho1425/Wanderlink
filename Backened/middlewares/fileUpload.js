const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, bytes) {
      if (err) return cb(err);
      const ext = path.extname(file.originalname);
      const filename = bytes.toString("hex") + ext;
      cb(null, filename);
    });
  },
});
const fileUpload = multer({ storage: storage });
module.exports = fileUpload;
