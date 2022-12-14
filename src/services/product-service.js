const Product = require('../models/product-model');
const enums = require('../enums/product-enums');
const responseHandler = require('../response/response-handler');
const LOG = require('../log/log');
const crypto = require("crypto");
const { file } = require('../enums/file-enums');
const algorithm = "aes-256-cbc";
var mongoose = require("mongoose");
const multer = require('multer')
const upload = multer({dest:'upload/'})
 



const createProduct = async (req, res) => {
    console.log(req.files)

    if (req.body) {
        new Promise(async (resolve, reject) => {
            const product = new Product();

            product.sku = req.body.sku;
            product.quantity = req.body.quantity;
            product.product_name = req.body.product_name;
            product.images = req.body.images;
            product.product_description = req.body.product_description;

            await product.save();

            let responseData = {
                sku: product.sku,
                quantity: product.quantity,
                product_name: product.product_name,
                images: product.images,
                product_description: product.product_description,
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

const editProduct = async (req, res) => {

    console.log(req.params.id)

    // var _id = mongoose.mongo.ObjectId(req.params.id);
    // console.log(_id);

    if (!req.is("application/json")) {
        res.sendStatus(400);
    } else {
        console.log('insideeee')
        Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    sku: req.body.sku,
                    quantity: req.body.quantity,
                    product_name: req.body.product_name,
                    images: req.body.images,
                    product_description: req.body.product_description,
                }
            },
            {upsert:true},

            function (err, result) {
                if (err) {
                  res.status(500).send(err);
                  LOG.info(enums.filesave.UPDATE_ERROR);
                } else {
                  res.status(200).send(result);
                  LOG.info(enums.filesave.UPDATE_SUCCESS);
                }
              }
        )
    }
}


const deleteProduct = async (req, res) =>{
     const id = req.params.id;
    await Product.findByIdAndDelete(id)
    .then((response) => {
        responseHandler.respond(res, response);
        LOG.info(enums.filesave.DELETE_SUCCESS);
      })
      .catch((error) => {
        responseHandler.handleError(res, error);
        LOG.info(enums.filesave.DELETE_ERROR);
      });
}

module.exports = { 
    createProduct,
     editProduct ,
     deleteProduct,
     deleteProduct
    }