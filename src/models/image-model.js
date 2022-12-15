const mongoose = require("mongoose");

//creating db schema for images
const ImageSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, 'name required'],
            trim:true,
        },
        path:{
            type:String,
            required:[true, 'Value required'],
            trim:true,
        },
        isThumbnail:{
            type:Boolean,
            trim:true,
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Products"
        }
        
    }

)

const image = mongoose.model('Images', ImageSchema);
module.exports = image;