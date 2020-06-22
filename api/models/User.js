const mongoose =require('mongoose');

const User=new mongoose.Schema({
    id:{
        required:true,
        type:String
    },
     thirdPartyAuthId:{
         type:String
     },
     username:{
         required:true,
         type:String
     },
     fullName:{
         required:true,
         type:String
     },
     bio:{
         type:String
     },
     email:{
         required:true,
         type:String
     },
     password:{
         required:true,
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
     },
     following:{
         type:Array(String),
         default:[]
     },
     followers:{
         type:Array(String),
         default:[]
     }
});


module.exports=mongoose.model('User',User);
