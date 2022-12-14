const express = require("express");
const router = express.Router();
const userController = require("../services/user-service");
const auth = require("../middleware/authentication");

module.exports =   function () {
  router.post("/create", auth,  userController.createUser );
  router.post("/login", userController.loginUser );
  router.put("/update/password", auth ,userController.updatePassword );
  router.get("/getall", auth, userController.getAllUsers);
  router.get("/get/:id", auth, userController.getUserById);
  return router;
};
