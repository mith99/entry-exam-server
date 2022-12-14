const { randomBytes } = require('crypto');
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {   
    file : {
      type: String,
      required: [true, 'File is required'],
      trim: true,
    },
    fileSecurityKey : {
      type: String,
      required: true,
      trim: true,
    },
    fileInitVector : {
      type: String,
      required: true, 
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    fileUploadedDate: { 
      type: String, 
      required: false, 
      trim: true 
    },
    fileUploadedTime: { 
      type: String,
      required: false, 
      trim: true },
  }
);

const File = mongoose.model("files", FileSchema);
module.exports = File;