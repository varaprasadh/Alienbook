const mongoose = require('mongoose');
const {ObjectId,String} = mongoose.Schema.Types;
const Like=require("./Like");
const Reply=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    text:{
        required:true,
        type:String
    }
})
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
        default:Date.now 
    },
    reactions:{
        type:[Like.Schema],
        default:[]
    },
    replies:{
        type:[]
    }
})

module.exports = new mongoose.model('Comment',Comment);
