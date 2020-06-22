const mongoose = require('mongoose');
const {ObjectId,String} = mongoose.Schema.Types;

const Comment = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    user_id: String,
    text:{
        type:String,
        required:true,
    },
    timestamp:{
        type: Date,
        required:true,
        default:Date.now 
    }
})

module.exports = new mongoose.model('Comment',Comment);
