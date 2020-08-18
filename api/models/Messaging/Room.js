const mongoose = require('mongoose');
const Message=require("./Message");

const Room = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    people:{
        type:[String],
        required:true
    },
    messages:{
      type:[Message],
      default:[]
    }
})

module.exports = new mongoose.model('Room', Room);
