const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Message title is required'],
      trim: true,
    },
    message : {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User is required'],
      ref: 'users',
    },
    messageDate: { 
      type: String, 
      required: false, 
      trim: true 
    },
    messageTime: { 
      type: String,
      required: false, 
      trim: true 
    },
    messageSecurityKey : {
      type: String,
      required: true,
      trim: true,
    },
    messageInitVector : {
      type: String,
      required: true, 
      trim: true,
    },
  }
);

const Message = mongoose.model("messages", MessageSchema);
module.exports = Message;