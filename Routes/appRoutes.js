const express = require("express");
const route = express.Router();
const validateUsers = require("../Middlewares/usersValidate");
const AuthCheck = require("../middlewares/authvalidate");
const validateId = require("../Middlewares/validateUser");
const controller = require("../Controllers/appController");
const multer = require("multer");
const path = require("path");
route.post(
  "/register",
  validateUsers.validateRegistration,
  controller.userRegister
);
route.post("/login", validateUsers.validateUser, controller.userLogin);
route.get("/", AuthCheck, controller.getAllUsers);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();

    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".PNG" &&
      ext !== ".jpg" &&
      ext !== ".JPG" &&
      ext !== ".gif" &&
      ext !== ".jpeg"
    ) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    //file size limited to 2mb
    fileSize: 1024 * 1024 * 2,
  },
});
route.post(
  "/avatar",
  AuthCheck,
  upload.single("avatar"),
  validateId,
  controller.fileUpload
);
route.put("/", AuthCheck, controller.updatePost);
route.delete("/", AuthCheck, controller.deletePost);

module.exports = route;
