const mongoose =require('mongoose');

const Notification =require("../models/Notification");

const pictureSchema=new mongoose.Schema({
    profile:{
        type:Object,
        default:null
    },
    cover:{
        type:String,
        default:null
    },
    featured:{
        type:[String],
        default:[]
    }
})
  
const User=new mongoose.Schema({
    id:{
        required:true, 
        type:String
    },
     open_id:{ 
         type:String,
         required:true,
         unique:true
     },
     username:{
         required:true,
         type:String,
         unique:true
     },
     fullName:{
         required:true,
         type:String
     },
     pictures:{
       type: pictureSchema,
       default:{}
     },
     bio:{
         type:String
     },
     Role:{
         type:String,
         default:"USER",
         required:true
     },
     createdAt:{
         required:true,
         type:Date,
         default:Date.now
     }
});


module.exports=mongoose.model('User',User);
