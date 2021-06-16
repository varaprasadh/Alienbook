const mongoose = require('mongoose');
const {ObjectId,String} = mongoose.Schema.Types;
const Reaction=require("./Reaction");

const Comment = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    post_id:{
        type:String,
        required:true
    },
    parent:{
        type:String
    },
    parents:{
        type:[String],
        default:[]
    },
    content:{
        type:String,
        required:true,
    },
    timestamp:{
        type: Date,
        default:Date.now 
    },
    depth:{
        type:Number,
        default:1
    },
})

module.exports = new mongoose.model('Comment',Comment);
