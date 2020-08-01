const mongoose =require('mongoose');
const {ObjectId} =mongoose.Schema.Types;

const Like =require("./Like");
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
      required:true,
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
        type:Array,
        default:[]
    },

    // tags:{
    //     type:Array(String),
    //     default:[]
    // },
    // people:{
    //     type:Array(String),
    //     default:[]
    // },
    lastModifiedAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    likes:{
        type:[Like.Schema],
        default:[]
    },
    comments:{
        type:[Comment.Schema],
        default:[]
    }
});
module.exports = mongoose.model('Post', Post);
