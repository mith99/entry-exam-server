const express = require("express");

const router = express.Router();


const productService = require('../services/product-service')
const upload = require('../storage')

module.exports = function () {
    router.post("/create", upload.upload.any('image'), productService.createProduct);
    router.put("/edit/:id", productService.editProduct);
    router.delete("/delete/:id", productService.deleteProduct);
    router.get("/all", productService.getProducts);
    router.get("/search/:query", productService.search);
    router.post("/getProduct", productService.getProduct);

    return router;
}
