// Create the authentication middleware here
const jwt = require ('jsonwebtoken');
const responseHandler = require('../response/response-handler');
const User = require ('../models/user-model');

module.exports = async function auth(req, res, next) {
  try {
    const TOKEN = req.header('Authorization').replace('Bearer ', '');
    const DECODE = jwt.verify(TOKEN, 'ABC_CompanySecret');   
    const user = await User.findOne({ _id: DECODE._id, token: TOKEN });

    if (!user) {
      throw new Error(
        'Error from auth middleware - Please authenticate to the system'
      );
    }    
    req.token = TOKEN;
    req.user = user;
    next();
  } catch (error) {
     responseHandler.handleError(res, error, "Token expired");
  }
};