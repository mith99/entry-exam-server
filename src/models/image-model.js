import mongoose, { Schema } from "mongoose";

//creating db schema for images
const ImageSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, 'name required'],
            trim:true,
        },
        value:{
            type:String,
            required:[true, 'Value required'],
            trim:true,
        },
        isThumbnail:{
            type:Boolean,
            trim:true,
        },
        
    }

)

const image = mongoose.Model('Images', ImageSchema);
module.exports = image;