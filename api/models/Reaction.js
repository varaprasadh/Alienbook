const mongoose = require('mongoose');
const {ObjectId,String} = mongoose.Schema.Types;
const Reaction = new mongoose.Schema({
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
    parent_id:{
        type:String,
        default:null
    },
    type:{
       type:String,
       default:"LIKE" //love,haha,sad,wow,care   
    },
    timestamp:{
        type: Date,
        default:Date.now
    }
});


module.exports = new mongoose.model('Reaction', Reaction);
