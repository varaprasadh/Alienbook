const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;
const Reaction = require("../models/Reaction");

const Post = require("../models/Post");

const Comment=require("../models/Comment")


Router.post("/like",async (req,res)=>{
 const user_id=req.user.id;
 const {post_id,type,parent_id=null}=req.body;

 try{
   let parents=[];
   if(parent_id){
       const parent=await Comment.findOne({id:parent_id});
       parents=[...parent.parents];
   }else{
       parents.push(post_id);
   }
   let reaction = await Reaction.findOne({
       post_id,
       user_id,
       parent: parent_id || post_id
   });
   if (reaction) {
     reaction.type = type;
   }
   else{
        reaction = new Reaction({
            id: uuid(),
            user_id: user_id,
            post_id: post_id,
            type: type,
            parent:parent_id||post_id,
            parents:parents
        });
   }

   const savedReaction = await reaction.save();
   res.status(200).json({
       message:"liked",
       reaction:savedReaction._doc,
   });
 }catch(err){
     res.status(400).json({
         error:err.message
     })
 }
});
Router.post("/dislike",async (req,res)=>{
    const user_id=req.user.id;
    const {post_id,parent_id}=req.body;
    try{
        // await Reaction.deleteOne({user_id,post_id});
        const disliked=await Reaction.findOneAndRemove({user_id,post_id,parent: parent_id});
        console.log(disliked);
        res.status(200).json({
            message:"disliked",
        });
    }catch(err){
        res.status(400).json({
            error:err.message
        });
    }
})



Router.get("/likes",(req,res)=>{
    const {post_id,parent_id}=req.query;
    const skip= parseInt(req.query.skip) || 0;
    const user_id=req.user.id;

    Reaction.aggregate([
             {
                $match: {
                    post_id,
                    parent:parent_id || post_id
                }
             },
            {
                $lookup: {
                    from: "users",
                    as: "userData",
                    localField: "user_id",
                    foreignField: "id"
                }
            }, 
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays:true
                }
            }, 
            {
                $project: {
                    username: "$userData.username",
                    timestamp: 1,
                    type: 1,
                    parent:1
                }
            }
    ]).skip(skip).limit(20).then((reactions)=>{
        res.status(200).json({
            reactions,
            completed:reactions.length<20
        });
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        })
    });
});



module.exports=Router;