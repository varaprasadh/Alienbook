const mongoose = require('mongoose');

const Message = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    sender:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    read:{
        type:false,
        default:false
    }
});

module.exports = new mongoose.model('Message', Message);
