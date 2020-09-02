

const Conversation=require("../models/Conversation");
const Message=require("../models/Message");
const uuid=require("uuid").v4;




class ConversationManager{
    constructor() {
       
    }

    createConversation(participents){
        //check if exactly the participeints exists then decide
                 

        return //conversation 
    },

    //message with conversation id
    //anonymous message with participents
    handleMessage(content,user_id,conversation_id,participents){
       return new Promise(async (resolve,reject)=>{
             try{
                  if (participents.length <= 1) {
                      throw new Error("insufficient pariticipents");
                  }
                  if (!content || content.trim() === "") {
                      throw new Error("content should not be empty");
                  }
                  if (!conversation_id) {
                      //cant create duplicate group for two users
                      if (participents.length == 2) {
                          let conversation = await Conversation.find({
                              "$and": [{
                                      "participents": {
                                          "$all": participents
                                      }
                                  },
                                  {
                                      "participents": {
                                          "$size": 2
                                      }
                                  }
                              ]
                          });
                          if (conversation) {
                              conversation_id = conversation.id;
                          }

                      }
                      if (!conversation_id) {
                          let conversation = new Conversation({
                              participents: participents,
                              id: uuid()
                          });
                          let savedConversation = await conversation.save();
                          conversation_id = savedConversation.id;
                      }
                  }
                  //now do the trick
                  // we have conversation id and participents
                  const message = new Message({
                      id: uuid(),
                      conversation_id: conversation_id,
                      sender_id: user_id,
                      content: content
                  });
                  const savedMessage = await message.save();

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
        return new Promise((resolve,reject)=>{
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
    getInbox(user_id,skip){
         //inbox list
         //conversation user/group data last message
    }
    getConversation(conversation_id,user_id,skip){
        //returns messages on chat screen

    }
    
}

















/*
   - create conversation
   - remove conversation
   - get conversations :(userid,skip) ->[]

 * create conversation  
 * leave conversation
 * 
 * 
 * a chats with b
 * a removes conversation
 *        - marks all message deleted_by[] a  
 *       
 *  
 * b send message after some time. 
 *     
 *           
 */
