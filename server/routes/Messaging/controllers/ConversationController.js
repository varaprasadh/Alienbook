

const Conversation=require("../models/Conversation");
const Message=require("../models/Message");
const uuid=require("uuid").v4;




class ConversationManager{
    constructor() {
       
    }

    
    //message with conversation id
    //anonymous message with participents
    handleMessage(content,user_id,conversation_id){
       return new Promise(async (resolve,reject)=>{
             try{

                  if (!content || content.trim() === "") {
                      throw new Error("content should not be empty or null");
                  }
                  const conversation=await Conversation.findOne({id:conversation_id});
                  conversation.deleted_by=[];
                  const message = new Message({
                      id: uuid(),
                      conversation_id: conversation_id,
                      sender_id: user_id,
                      content: content
                  });
                  await conversation.save();
                  const savedMessage = await message.save();

                  resolve(savedMessage);
                  //return aggregated message
             }catch(err){
                reject(err);
             }
       })
    };
    

    //deletes whole conversation history
    deleteConversation(conversation_id,user_id){
        //marks all messages deleted by userid
        //put user id in removed_by
        //check if removed_by===participents 
            // - delete conversation and messages
        return new Promise(async (resolve,reject)=>{
            try {
                const conversation = await Conversation.findOne({
                    id: conversation_id
                });
                if (!conversation) {
                    throw new Error("conversation doesnt exist");
                }
                conversation.deleted_by.push(user_id);

                if (conversation.deleted_by.length != 0 && conversation.participents.length === conversation.deleted_by.length) {
                    //remove the conversation
                    //delete its messages too
                    await conversation.remove();
                    await messageController.removeZombieMessages(conversation_id);

                }else{
                    //mark all messages deleted by this user
                    await Message.updateMany({
                        conversation_id: conversation_id
                    }, {
                        $addToSet:{
                            deleted_by:user_id
                        }
                    });
                    
                    await conversation.save();
                }

            } catch (err) {
                reject(err);
            }
        })
    }
}


module.exports=ConversationManager;
