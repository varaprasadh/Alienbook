const mongoose = require('mongoose');
const Message=require("./Message");


const Conversation = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    description:{
      type:String,
      default:"",
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    lastMessage:{
        type:{
            from:String,
            content:String
        },
        default:{}
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
