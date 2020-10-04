const mongoose = require('mongoose');
const Message=require("./Message");


const Conversation = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title:{
       type:String,
       default:""
    },
    description:{
      type:String,
      default:"",
    },
    is_group:{
        type:Boolean,
        default:false
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    participents:{
        type: [String],
        required:true
    },
    deleted_by:{
        type:[String],
        default:[]
    }
});

module.exports = new mongoose.model('Conversation', Conversation);

