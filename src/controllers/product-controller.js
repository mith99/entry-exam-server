const express = require("express");

const router = express.Router();


const productService = require('../services/product-service')
const upload = require('../storage')

module.exports = function () {
    router.post("/create", upload.upload.any('image'), productService.createProduct);
    router.put("/edit/:id", productService.editProduct);
    router.delete("/delete/:id", productService.deleteProduct);
    return router;
}
