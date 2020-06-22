const mongoose=require('mongoose');

const Tag=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    label:{
        type:String,
        required:true,
        unique:true
    },
})

module.exports=mongoose.model('Tag',Tag);
