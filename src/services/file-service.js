const express = require("express");
const File = require('../models/file-model');
const enums = require('../enums/file-enums');
const responseHandler = require('../response/response-handler');
const LOG = require('../log/log');
var fs = require('fs');
const crypto = require("crypto");
const algorithm = "aes-256-cbc";

//upload file
const uploadFile = async (req, res) => {
  if (req.body && req.user.userType == "MANAGER") {
    new Promise(async (resolve, reject) => {

      var url = req.body.file;

      // generate initvector 16 bytes of random data
      const initVector = crypto.randomBytes(16);
      // secret key generate 32 bytes of random data
      const Securitykey = crypto.randomBytes(32);

      // the cipher function
      const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

      // encrypt the message
      // input encoding
      // output encoding
      let encryptedData = cipher.update(url, "utf-8", "hex");
      encryptedData += cipher.final("hex");


      // convert the security key to base64 string
      const base64dataSecuritykey = Buffer.from(Securitykey, 'binary').toString('base64');
      // convert the initialization vector to base64 string
      const base64dataInitVector = Buffer.from(initVector, 'binary').toString('base64');

      const file = new File();
      file.file = encryptedData;
      file.fileSecurityKey = base64dataSecuritykey,
        file.fileInitVector = base64dataInitVector,
        file.createdBy = req.body.createdBy;
      file.fileUploadedDate = new Date().toLocaleDateString();
      file.fileUploadedTime = new Date().toTimeString();

      await file.save();

      let responseData = {
        file_id: file._id,
        file: file.file,
        createdBy: file.createdBy,
        fileUploadedDate: file.fileUploadedDate,
        fileUploadedTime: file.fileUploadedTime,
      };

      return resolve({ responseData });
    })
      .then((data) => {
        LOG.info(enums.filesave.CREATE_SUCCESS);

        responseHandler.respond(res, data);
      })
      .catch((error) => {
        LOG.info(enums.filesave.CREATE_ERROR);
        responseHandler.handleError(res, error.message);
      });
  } else {
    return responseHandler.handleError(res, enums.roleIssue.ONLY_MANAGER);
  }

}

//view files by user 
const viewFilesByUserId = async (req, res) => {

  if (req.body && req.user.userType == "MANAGER" && req.user._id == req.params.id) {
    await File.find({ createdBy: req.params.id })
      .sort({ fileUploadedDate: -1 })
      .then((data) => {
        for (i = 0; i < data.length; i++) {

          // Convert security key from base64 to buffer
          const convertedSecurityKey = Buffer.from(data[i].fileSecurityKey, 'base64');
          // Convert initialize vector from base64 to buffer
          const convertedInitVector = Buffer.from(data[i].fileInitVector, 'base64');

          // Decrypt the string using encryption algorith and private key
          const decipher = crypto.createDecipheriv(algorithm, convertedSecurityKey, convertedInitVector);
          let decryptedData = decipher.update(data[i].file, "hex", "utf-8");
          decryptedData += decipher.final("utf-8");

          data[i].fileSecurityKey = ""
          data[i].fileInitVector = ""
          data[i].file = decryptedData
        }

        res.status(200).send({ data: data });
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
      });
  }
  else {
    return responseHandler.handleError(res, enums.roleIssue.ONLY_MANAGER);
  }


};

module.exports = {
  uploadFile,
  viewFilesByUserId
}