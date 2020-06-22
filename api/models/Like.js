const mongoose = require('mongoose');
const {ObjectId,String} = mongoose.Schema.Types;
const Like = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    user_id: String,
    timestamp:{
        type: Date,
        required:true,
        default:Date.now
    }
})

module.exports = new mongoose.model('Like',Like);
