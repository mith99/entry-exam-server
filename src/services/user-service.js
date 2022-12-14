const express = require("express");
const User = require("../models/user-model");
const enums = require("../enums/user-enum");
const responseHandler = require("../response/response-handler");
const LOG = require("../log/log");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
var mongoose = require("mongoose");

//creating a new user
const createUser = async (req, res) => {
  if (req.body && req.body.email && req.user.userType == "ADMIN") {
    new Promise(async (resolve, reject) => {
      let userEmail = req.body.email;
      //find if user already exists
      let user = await User.findOne({ email: userEmail });
      if (user) {
        return resolve(enums.user.ALREADY_EXIST);
      }

      user = new User(req.body);
      //hashing passowrd
      user.password = await bcrypt.hash(user.password, 8);
      await user.save();

      // user.loginStatus = false;
      // await user.save();

      //generating the user token
      const TOKEN = jwt.sign({ _id: user._id }, "ABC_CompanySecret");
      user.token = TOKEN;
      //saving the user token
      await user.save();

      let responseData = {
        user_id: user._id,
        firstName: user.firstName,
        lasttName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        token: TOKEN,
        userType: user.userType,
        loginStatus: user.loginStatus,
      };
      return resolve({ responseData, TOKEN });
    })
      .then((data) => {
        if (data === enums.user.ALREADY_EXIST) {
          LOG.warn(enums.user.ALREADY_EXIST);
        } else {
          LOG.info(enums.user.CREATE_SUCCESS);
        }

        responseHandler.respond(res, data);
      })
      .catch((error) => {
        LOG.info(enums.user.CREATE_ERROR);
        responseHandler.handleError(res, error.message);
      });
  }
};

//login user
const loginUser = async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    let { email, password } = req.body;

    new Promise(async (resolve, reject) => {
      try {
        // check if user email exists
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error(enums.user.NOT_FOUND);
        }
        //compare if the entered and existing password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error(enums.user.PASSWORD_NOT_MATCH);
        }

        //generating the user token
        const TOKEN = jwt.sign({ _id: user._id }, "ABC_CompanySecret", {
          expiresIn: "18000s",
        });
        user.token = TOKEN;
        //saving the user token
        await user.save();

        let responseData = {
          user_id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          token: TOKEN,
          userType: user.userType,
          loginStatus: user.loginStatus,
        };
        return resolve({ responseData });
      } catch (error) {
        return resolve(error.message);
      }
    })
      .then((data) => {
        if (data === enums.user.NOT_FOUND) {
          LOG.warn(enums.user.NOT_FOUND);
        } else if (data === enums.user.PASSWORD_NOT_MATCH) {
          LOG.warn(enums.user.PASSWORD_NOT_MATCH);
        } else {
          LOG.info(enums.user.LOGIN_SUCCESS);
        }
        responseHandler.respond(res, data);
      })
      .catch((error) => {
        LOG.info(enums.user.LOGIN_ERROR);
        responseHandler.handleError(res, error.message);
      });
  } else {
    return responseHandler.handleError(res, enums.user.CREDENTIAL_REQUIRED);
  }
};

const updatePassword = async (req, res) => {
  if (req.body && req.body.id && req.body.oldPassword && req.body.newPassword) {
    let { id, oldPassword, newPassword } = req.body;

    //const token = req.body.token;

    //let password = req.body.newPassword;

    //convert the string to object id
    var _id = mongoose.mongo.ObjectId(id);
    console.log(_id);

    const user = await User.findById({ _id });
    console.log(user);
    console.log(user.password);

    const validatePassword = await bcrypt.compare(oldPassword, user.password);
    console.log(validatePassword);

    //console.log(validatePassword);
    if (validatePassword) {
      //const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, 8);

      User.findOneAndUpdate(
        { _id: id },
        { $set: { password: newPassword, loginStatus: true } },
        { upsert: false },
        function (err, result) {
          if (err) {
            res.send(500, body);
          } else {
            res.send(200, result);
          }
        }
      );
    } else {
      res.status(500).json({ message: "Passwords doesn't match" });
    }
  }
};

//get all users
const getAllUsers = async (req, res) => {
  if (req.user.userType == "ADMIN") {
    await User.find({})
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
  }
};

//get user by Id
const getUserById = async (req, res, next) => {
  if (req.params && req.params.id) {
    const id = req.params.id;
    await User.findOne({ id })
      .then((data) => {
        res.status(200).json(data);
        next();
      })
      .catch((error) => {
        res.status(500).json(error.message);
        next();
      });
  } else {
    return responseHandler.handleError(res, enums.user.NOT_FOUND);
  }
};

module.exports = {
  createUser,
  loginUser,
  updatePassword,
  getAllUsers,
  getUserById,
};
