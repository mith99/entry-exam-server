const mongoose = require("mongoose");

//creating db schema for product
const ProductSchema = new mongoose.Schema(
    {
        sku:{
            type:String,
            required:[true, 'SKU required'],
            trim:true,
        },
        quantity:{
            type:String,
            required:[true, 'Qunatity required'],
            trim:true,
        },
        product_name:{
            type:String,
            required:[true, 'Name required'],
            trim:true,
        },
        images:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Images"
        }],
        product_description:{
            type:String,
            required:[true, 'Description required'],
            trim:true,
        }

    }

)

const product = mongoose.model('Products', ProductSchema);
module.exports = product;