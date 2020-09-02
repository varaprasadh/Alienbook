const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const uuid=require("uuid").v4;


class MessageManager{
    constructor(){

    }

    //do later
    deleteMessage(message_id,user_id){
        //check if creator id==user id
        // append user_id to deleted_by 
        //check if deleted_by===participents of the conver
          // - delete direclty
        return new Promise(async (resolve,reject)=>{
              try{
                  const message=await Message.findOne({id:message_id});
                  if(!message){
                      throw new Error("message doenst exist");
                  }
                  message.deleted_by.addToSet(user_id);
                  resolve(await message.save());
              }catch(err){
                  reject(err);
              }
        }) 
    }

    //impliment later
    markasRead(message_id,user_id){
       //apend to read_by the userid
       //trigger an event for all the pariticipents that this guy read this

    }
    //primary to do
    createMessage(conversation_id,sender_id,content){
       const message=new Message({
           id:uuid(),
           conversation_id,
           sender_id,
           content
       });
       return message;
    };
    removeZombieMessages(conversation_id){
        console.log("getting rid of zombies");
        return Message.deleteMany({conversation_id:conversation_id});
    }

}

module.exports = MessageManager;
