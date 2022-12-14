const express = require("express");
const Message = require("../models/message-model");
const enums = require("../enums/message-enums");
const LOG = require("../log/log");
const responseHandler = require("../response/response-handler");
//Message encryption imports
const crypto = require ("crypto");
const algorithm = "aes-256-cbc"; 


//Save Message Function
const saveMessage = async (req, res) => {
  if (req.body) {
    // generate initvector 16 bytes of random data
    const initVector = crypto.randomBytes(16);
    // secret key generate 32 bytes of random data
    const Securitykey = crypto.randomBytes(32);

    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

    // encrypt the message
    // input encoding
    // output encoding
    let encryptedData = cipher.update(req.body.message, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    // convert the security key to base64 string
    const base64dataSecuritykey = Buffer.from(Securitykey, 'binary').toString('base64');
    // convert the initialization vector to base64 string
    const base64dataInitVector = Buffer.from(initVector, 'binary').toString('base64');
    const message = new Message();
    message.createdBy = req.body.createdBy;
    message.title = req.body.title;
     //encrypt message
    message.message =encryptedData;
    message.messageSecurityKey = base64dataSecuritykey,
    message.messageInitVector = base64dataInitVector, 
    message.messageDate = new Date().toLocaleDateString();
    message.messageTime = new Date().toTimeString();
    await message
      .save()
      .then((data) => {
        responseHandler.respond(res, data);
        LOG.info(enums.messagesave.CREATE_SUCCESS);
      })
      .catch((error) => {
        responseHandler.handleError(res, error.message);
        console.log(error);
        LOG.info(enums.messagesave.CREATE_ERROR);
      });
  }
};


//View all Messages Function with decrypt code
const getAllMessages = async (req, res) =>{
  await Message.find({})
    .sort({messageDate: -1})
    .then((data) => {
      for (i = 0; i < data.length; i++){      

        // Convert security key from base64 to buffer
        const convertedSecurityKey = Buffer.from(data[i].messageSecurityKey, 'base64');
        // Convert initialize vector from base64 to buffer
        const convertedInitVector= Buffer.from(data[i].messageInitVector, 'base64');

        // Decrypt the string using encryption algorith and private key
        const decipher = crypto.createDecipheriv(algorithm, convertedSecurityKey , convertedInitVector);
        let decryptedData = decipher.update(data[i].message, "hex", "utf-8");
        decryptedData += decipher.final("utf-8");

        data[i].messageSecurityKey = ""
        data[i].messageInitVector =""
        data[i].message = decryptedData
      }      
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json(error.message);
      LOG.info(enums.message.NOT_FOUND);
    });
};


//Get Messages By User ID
const viewMessageByUserId = async (req, res) => {
  await Message.find({ createdBy: req.params.id})
    .sort({ messageDate: -1 })
    .then((data) => {
      for (i = 0; i < data.length; i++){      

        // Convert security key from base64 to buffer
        const convertedSecurityKey = Buffer.from(data[i].messageSecurityKey, 'base64');
        // Convert initialize vector from base64 to buffer
        const convertedInitVector= Buffer.from(data[i].messageInitVector, 'base64');

        // Decrypt the string using encryption algorith and private key
        const decipher = crypto.createDecipheriv(algorithm, convertedSecurityKey , convertedInitVector);
        let decryptedData = decipher.update(data[i].message, "hex", "utf-8");
        decryptedData += decipher.final("utf-8");

        data[i].messageSecurityKey = ""
        data[i].messageInitVector =""
        data[i].message = decryptedData
      }      

      res.status(200).send({ data: data });
      LOG.info(enums.message.MESSAGE_DATA);
    })
    .catch((error) => {
      res.status(500).send({ error: error.message });
      LOG.info(enums.message.NOT_FOUND);
    });
};


//Update Message 
const editMessageInfo = async(req, res) => {
  if (!req.is("application/json")) {
    res.send(400);
  } else {
    // generate initvector 16 bytes of random data
    const initVector = crypto.randomBytes(16);
    // secret key generate 32 bytes of random data
    const Securitykey = crypto.randomBytes(32);

    // the cipher function
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

    // encrypt the message
    // input encoding
    // output encoding
    let encryptedData = cipher.update(req.body.message, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    // convert the security key to base64 string
    const base64dataSecuritykey = Buffer.from(Securitykey, 'binary').toString('base64');
    // convert the initialization vector to base64 string
    const base64dataInitVector = Buffer.from(initVector, 'binary').toString('base64');
    Message.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          message:encryptedData,
          messageDate: new Date().toLocaleDateString(),
          messageTime: new Date().toTimeString(),
        },
      },
      { upsert: true },
      function (err, result) {
        for (i = 0; i < result.length; i++){      

          // Convert security key from base64 to buffer
          const convertedSecurityKey = Buffer.from(result[i].messageSecurityKey, 'base64');
          // Convert initialize vector from base64 to buffer
          const convertedInitVector= Buffer.from(result[i].messageInitVector, 'base64');
  
          // Decrypt the string using encryption algorith and private key
          const decipher = crypto.createDecipheriv(algorithm, convertedSecurityKey , convertedInitVector);
          let decryptedData = decipher.update(result[i].message, "hex", "utf-8");
          decryptedData += decipher.final("utf-8");
  
          result[i].messageSecurityKey = ""
          result[i].messageInitVector =""
          result[i].message = decryptedData
        } 
        if (err) {
          res.status(500).send(body);
          LOG.info(enums.messagesave.UPDATE_ERROR);
        } else {
          res.status(200).send(result);
          LOG.info(enums.messagesave.UPDATE_SUCCESS);
        }
      }
    );
  }
};


//remove messages
const deleteMessage = async (req,res) => {
  //check if the req body is empty
  const id = req.params.id;
  console.log(id);
  //delete product data from database
  await Message.findByIdAndDelete(id)
    .then((response) => {
      responseHandler.respond(res, response);
      LOG.info(enums.messagesave.DELETE_SUCCESS);
    })
    .catch((error) => {
      responseHandler.handleError(res, error);
      LOG.info(enums.messagesave.DELETE_ERROR);
    });
};


module.exports = {
  saveMessage,
  getAllMessages,
  editMessageInfo,
  deleteMessage,
  viewMessageByUserId,
}

