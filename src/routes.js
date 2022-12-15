// Call routes here
const productController = require('./controllers/product-controller')

module.exports =   function (app) {
    //API endpoints of product
    app.use('/product', productController());
};