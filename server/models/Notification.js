const mongoose = require('mongoose');

const Notification = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    initiator: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    parent_id:{
        type:String,
        required:true
    },
    parents:{
        type:[String],
        required:true
    },
    content: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('notification',Notification);
