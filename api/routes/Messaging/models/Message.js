const mongoose = require('mongoose');
const Conversation =require("./Conversation");


const Message = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    conversation_id:{
       type:String,
       required:true
    },
    sender_id:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    read_by:{
        type:[String],
        default:[]
    },
    deleted_by:{
        type:[String],
        default:[]
    }
});
//works - if message is deleted by all participents it gets deleted automatically

Message.post('save',async (doc)=>{
    console.log("saved the document",doc);
    try{
      //find conversation pariticipents 
      const conversation=await Conversation.findOne({id:doc.conversation_id});
      console.log("lol", conversation);
      const participents = conversation.participents;
      if (doc.deleted_by.length != 0  && participents.length === doc.deleted_by.length) {
          doc.remove();
      }
    }catch(err){
       console.error(err);
    }
});

Message.post('remove',(doc)=>{
    console.log("removed the document",doc);
    //can trigger an socket event to update the client side 
})



module.exports = new mongoose.model('Message', Message);
