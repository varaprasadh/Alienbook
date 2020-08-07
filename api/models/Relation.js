const mongoose = require('mongoose');

const Notification = require("../models/Notification");

const Relation = new mongoose.Schema({
    
    source:{
        type:String,
        required:true
    },
    target:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    modified_at:{
        type:Date,
        default:Date.now
    },
})




module.exports = mongoose.model('Relation', Relation);
