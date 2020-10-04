const Router=require('express').Router();
const uuid=require("uuid").v4;

const User=require("../../../models/User");

const Message = require("../models/Message");

const Conversation=require("../models/Conversation");


const MessageController=require("../controllers/MessageController");
const ConversationController=require("../controllers/ConversationController");

const messageController=new MessageController();
const conversationController=new ConversationController();

const {query_people,query_people_recommended,query_people_get_by_ids}=require("./aggregations/people");

const {query_messages} =require("./aggregations/message")
const {query_conversations,query_get_coversation}=require("./aggregations/conversation");





Router.get("/channels",async (req,res)=>{
    const user_id=req.user.id;
    const skip=req.query.skip || 0;
    try{
       const channels = await Conversation.aggregate(query_conversations(user_id,skip));
       res.status(200).json({
         channels,
         completed:channels.length<20      
        })
    }catch(err){
        res.status(400).json({
            error:err.message
        })
    }
});
Router.get("/channels/:id",async (req,res)=>{
    const user_id = req.user.id;
    const conversation_id=req.params.id;
    try{
        if(!conversation_id) throw new Error("coversation id is required");
        const conversations=await Conversation.aggregate(query_get_coversation(user_id,conversation_id));
        res.status(200).json({
            conversation:conversations[0]
        });
    }
    catch(err){
       res.status(400).json({
           error:err.message
       })
    }
});
Router.post("/channels/delete", async (req, res) => {
    const {
        conversation_id,
        user_id
    } = req.body;
    try {
        await conversationController.deleteConversation(conversation_id);
        res.status(200).json({
            message: "conversation has been deleted!"
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
})

/*
 gets participent id's and returns temporary channel
*/
Router.post("/chat-preflight",async (req,res)=>{
     const user_ids=req.body.participents || []; 
     const current_user_id=req.user.id;

    try{
        user_ids.push(current_user_id);
        if (user_ids.length <= 1) {
            throw new Error("minimum 2 participents required to start chat!");
        }
        //if there is already a conversation between 2 users
        if(user_ids.length==2){
            //if exists then return that channel
            
        }
        const temporary_conversation_id=uuid();
        const participents= await User.aggregate(query_people_get_by_ids(user_ids));
        const channel={
            id:temporary_conversation_id,
            paritcipents: participents,
            messages:[],
            created_at:Date.now(),
            is_group: participents.length > 2,
            isNew:true
        }

        res.status(200).json({
            channel
        });

    }catch(err){
        res.status(400).json({
            error:err.message
        })
    }
})


/*
                  if (!conversation_id) {
                      //cant create duplicate group for two users
                      if (participents.length == 2) {
                          let conversation = await Conversation.findOne({
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
                              conversation.deleted_by = [];
                              // console.log("debug conversation",conversation);
                              await conversation.save();
                          }
                      }

                  }

*/


Router.post("/new-conversation", async (req, res) => {
    //create conversation
    //save message
    //publish changes

})

Router.post("/message", /*middleware to handle new conversation*/ async (req, res) => {

    //participents and message and conversation_id
    //if(conversation_id exist) then put the message broadcast message to partiticpentes
    //else create new conversation and then put the message in 
    const user_id = req.user.id;
    let conversation_id = req.body.conversation_id || null;
    const content=req.body.content;
    const isNew=req.body.isNew || false;

    //if its exist then id used otherwise it creates new conversation

    try {
        if (isNew) {
            const participents = req.body.participents || [];
            if (participents.length <= 1) {
               throw new Error("minimum 2 participents required to start chat!");
            }
           
            //create new channel
        }
        //aggregated message
        const aggregated_message = await conversationController.handleMessage(content, user_id, conversation_id, participents);
        res.json(aggregated_message);

        //publish to participents other than user_id itself;


    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});



Router.get("/messages", async (req,res)=>{
    const conversation_id=req.query.conversation_id;
    const user_id=req.user.id;
    const skip=req.query.skip || 0;
    try{
        console.log(conversation_id,!conversation_id);
        if (!conversation_id) {
           throw new Error("conversation_id is required");
        }
        const messages=await Message.aggregate(query_messages(conversation_id,user_id,skip));
        res.status(200).json({
            conversation_id,
            messages,
            completed:messages.length<20
        });
    }catch(err){
        res.status(400).json({
            error:err.message
        })
    }
});


Router.get("/people", async (req,res)=>{
    const name=req.query.q_name || "";
    const current_username=req.user.username;
    console.log(current_username,"lask");
    try{

       let people;
       if(name.trim()===""){
           //send recommended people
            people=await User.aggregate(query_people_recommended(current_username)).limit(20)
       }
       else{
           people=await User.aggregate(query_people(name,current_username)).limit(20)
       }
        res.json({
            people,
            completed:people.length<20
        });
    }catch(err){
        res.status(400).json({
            error:err.message
        })
    }
});

module.exports=Router;

/*

                      if (!conversation_id) {
                          let conversation = new Conversation({
                              id: uuid(),
                              participents: participents,
                              is_group: participents.length > 20
                          });
                          let savedConversation = await conversation.save();
                          conversation_id = savedConversation.id;
                      }

*/