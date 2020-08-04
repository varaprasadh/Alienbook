const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;
const Reaction = require("../models/Reaction");

const Post = require("../models/Post");
const NotificationService=require("./NotificationService");



Router.post("/like",async (req,res)=>{
 const user_id=req.user.id;
 const {post_id,type,parent_id}=req.body;
 try{
   let reaction=await Reaction.findOne({post_id,user_id,parent_id});
   if (reaction) {
     reaction.type = type;
   }else{
        reaction = new Reaction({
            id: uuid(),
            user_id: user_id,
            post_id: post_id,
            parent_id: parent_id,
            type: type
        });
   }
   const savedReaction = await reaction.save();
   res.status(200).json({
       message:"liked",
       reaction:savedReaction._doc
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
        await Reaction.deleteOne({user_id,post_id,parent_id});
        res.status(200).json({
            message:"disliked"
        });
    }catch(err){
        res.status(400).json({
            error:err.message
        });
    }
})
Router.post("/likes/:post_id",(req,res)=>{
    const {post_id,parent_id}=req.body;
    const skip= parseInt(req.query.skip) || 0;
    Reaction.aggregate([
            $match: {
                post_id,
                parent_id,
            },
            {
                $lookup: {
                    from: "users",
                    as: "userData",
                    localField: "user_id",
                    foreignField: "id"
                }
            }, {
                $unwind: {
                    path: "$userData",
                }
            }, {
                $project: {
                    username: "$userData.username",
                    timestamp: 1,
                    type: 1
                }
            }
    ]).skip(skip).limit(20).thenn((reactions)=>{
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