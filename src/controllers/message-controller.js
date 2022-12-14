const express = require("express");
const router = express.Router();

const messageController = require("../services/message-service");

module.exports =   function () {
  router.post("/create", messageController.saveMessage );
  router.get("/getall", messageController.getAllMessages);
  router.get("/view/:id",messageController.viewMessageByUserId);
  router.put("/edit/:id", messageController.editMessageInfo);
  router.delete("/delete/:id",messageController.deleteMessage);
  return router;
};

