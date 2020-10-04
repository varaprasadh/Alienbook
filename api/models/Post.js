const mongoose =require('mongoose');
const {ObjectId} =mongoose.Schema.Types;

const Like =require("./Reaction");
const Comment=require("./Comment");

const Post=new mongoose.Schema({
    id: {
         required: true,
         type: String
    },
    content:{
        type:String,
    },
    author:{
        type:String,
        required:true
    },
    createdAt:{
      type:Date,
      default:Date.now
    },
    saved:{
        type:[String]
    },
    refId:{
        type:String,
        default:null
    },
    type:{
        type:String,
        default:"NORMAL"
    },
    ref_author:{
        type:String,
    },
    images:{
        type:[Object],
        default:[]
    },
    tags:{
        type:[String],
        default:[]
    },
    people:{
        type:[String],
        default:[]
    },
    lastModifiedAt:{
        type:Date,
        required:true,
        default:Date.now
    }
});
module.exports = mongoose.model('Post', Post);
