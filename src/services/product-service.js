const Product = require('../models/product-model');
const Image = require('../models/image-model');
const enums = require('../enums/product-enums');
const responseHandler = require('../response/response-handler');
const LOG = require('../log/log');
const multer = require('multer');





const createProduct = async (req, res) => {

    console.log(req.body)

    if (req.body) {

        const product = new Product();

        product.sku = req.body.sku;
        product.quantity = req.body.quantity;
        product.product_name = req.body.product_name;
        product.images = req.body.images;
        product.product_description = req.body.product_description;

        await product.save()
            .then((data) => {
                LOG.info(enums.filesave.CREATE_SUCCESS);

                let responseData = {
                    sku: product.sku,
                    quantity: product.quantity,
                    product_name: product.product_name,
                    images: product.images,
                    product_description: product.product_description,
                };

                responseHandler.respond(res, responseData);
                console.log('success')
                let orname = '600px-IT_Operating_Model.png'
                uploadImage(data._id, req.files, orname)
            })
            .catch((error) => {
                LOG.info(enums.filesave.CREATE_ERROR);
                responseHandler.handleError(res, error.message);
                console.log(enums.filesave.CREATE_ERROR)
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
            { upsert: true },

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


const deleteProduct = async (req, res) => {
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


const uploadImage = async (id, files, thumbnail) => {
    console.log(files)

    const image = new Image();

    let imagesArr = []

    for (let i = 0; i < files.length; i++) {

        let isThumbnail = false;
        if (thumbnail == files[i].originalname) {
            isThumbnail = true
        }

        let imgObj = {
            name: files[i].originalname,
            path: files[i].path,
            isThumbnail: isThumbnail,
            product: id
        }

        imagesArr.push(imgObj)

    }

    Image.insertMany(imagesArr)
        .then((data) => {

            let idArr = []
            for (let i = 0; i < data.length; i++) {

                idArr.push(data[i]._id)
            }

            console.log(idArr)

            return Product.findByIdAndUpdate(id, {
                $push: {
                    images: idArr
                }
            },
                {
                    new: true, useFindAndModify: false
                })

            // Success
        }).catch(function (error) {
            console.log(error)      // Failure
        });




}


const getProducts = async (req, res) => {
    await Product.find({})
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            res.status(500).json(error.message);
            LOG.info(enums.message.NOT_FOUND);
        });
}

const getProduct = async (req, res) => {
    await Product.findById(req.body.id)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            res.status(500).json(error.message);
            LOG.info(enums.message.NOT_FOUND);
        });
}


const search = async (req, res, next) => {
    const query = req.params.query;

    console.log(req.params.query)
    Product.find({ product_name: { $regex: query, $options: "i" } })
        .then(prodName => {
            console.log(prodName)
            res.status(200).json(prodName)
        })
        .catch(err => {
            console.log(err);
        });
}




module.exports = {
    createProduct,
    editProduct,
    deleteProduct,
    getProducts,
    search,
    getProduct
}