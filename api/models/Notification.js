const mongoose = require('mongoose');

const Notification = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    read:{
        type:Boolean,
        default:false
    },
    initiator: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})
module.exports=mongoose.model('notification',Notification);
