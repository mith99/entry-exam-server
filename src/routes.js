// Call routes here
const express = require("express");
const userController = require('./controllers/user-controller')
const fileController = require('./controllers/file-controller')
const auth = require('./middleware/authentication');
const productController = require('./controllers/product-controller')
//Message routes
const messageController = require('./controllers/message-controller')

module.exports =   function (app) {
    //API endpoints of user
    app.use('/user',userController());

    //API endpoints of message
    app.use('/message',auth,messageController());

    //API endpoints of file
    app.use('/file', fileController());

    app.use('/product', productController());
};