const express = require("express");
const router = express.Router();

const fileController = require("../services/file-service");
const auth = require("../middleware/authentication");

module.exports =   function () {
  router.post("/upload", auth, fileController.uploadFile );
//   router.post("/login", userController.loginUser );
//   router.put("/update/password", auth ,userController.updatePassword );
//   router.get("/get/users", auth ,userController.getAllUsers );
  router.get("/:id", auth , fileController.viewFilesByUserId );
  return router;
};