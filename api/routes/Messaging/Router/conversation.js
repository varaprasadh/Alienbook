const Router=require('express').Router();
const uuid=require("uuid").v4;

const Message = require("../models/Message");

const Conversation=require("../models/Conversation");


const MessageController=require("../controllers/MessageController");

const messageController=new MessageController();


Router.post("/conversation/new",async (req,res)=>{
    // const user_id = req.user.id ;
    const user_id = "user-me";
    const participents = req.body.participents || [];
    let conversation_id=req.body.conversation_id || null;
    
    
    const chat_participents=[...participents,user_id];
    //check if same group exists
    try{
       
        //now use this conversation id and participents



    }catch(err){
        res.status(400).json({
            error:err.message
        });
    }
   
})


Router.post("/conversation/delete",async (req,res)=>{
    const {conversation_id,user_id}=req.body;

 

})
// Router.get("/dc/:id",async (req,res)=>{
//     const [conversation_id,user_id]=["1","1"];

//     try {
//         const conversation = await Conversation.findOne({
//             id: conversation_id
//         });
//         if(!conversation){
//             throw new Error("conversation doesnt exist");
//         }
//         conversation.deleted_by.push(user_id);
//         //check if
//         console.log("debug",conversation);
//         if (conversation.deleted_by.length != 0 && conversation.participents.length === conversation.deleted_by.length) {
//             //remove the conversation
//             //delete its messages too
//             await conversation.remove();
//             await messageController.removeZombieMessages(conversation_id);
        
//         }

//         res.status(200).json({
//             message:"conversation deleted"
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({
//             error: err.message
//         })
//     }
// })

Router.get("/message", (req, res) => {

    //participents and message and conversation_id
    //if(conversation_id exist) then put the message broadcast message to partiticpentes
    //else create new conversation and then put the message in 



    let msg = new Message({
        id: uuid(),
        conversation_id: "1",
        sender_id: uuid(),
        content: "hell wordll " + Date.now()
    });
    msg.save().then((doc) => {
        res.json(doc);
    }).catch(err => {
        res.end("error");
    })
})


Router.get("/cc",(req,res)=>{
    const _conv=new Conversation({
        id:"1",
        participents: ["1"]
    });
    
    _conv.save().then((rec)=>{
        res.json(rec);
    })
})



module.exports=Router;
