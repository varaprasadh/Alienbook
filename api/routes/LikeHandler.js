const Router = require('express').Router();
const User = require('../models/User');
const uuid = require('uuid').v1;
const Like =require("../models/Like");

const Post = require("../models/Post");


Router.post("/like",(req,res)=>{
    let {postId}=req.body;
    let userId = req.user.id;
    const like=new Like({
        user_id:userId,
        id:uuid()
    });
    Post.findOne({id:postId,"likes.user_id":{$nin:[userId]}}).then((post)=>{
       if(!post){
           throw new Error("already liked the post");
       }
       post.likes.addToSet(like);
       post.save().then(()=>{
            res.status(200).json({
                message: "liked the post"
            });
       }).catch(err=>{
           console.log(err);
           throw new Error("cant like the post");
       })
    
    }).catch(err=>{
        res.status(400).json({
            error:err.message
        });
    })
});


Router.post("/dislike",(req,res)=>{
    let {postId}=req.body;
     let userId = req.user.id;
    Post.update({id:postId},{$pull:{likes:{user_id:userId}}}).then(doc=>{
        if (doc.nModified===0){
            throw new Error("already disliked");
        }
        res.status(200).json({
            message:"disliked!"
        })
    }).catch(err=>{
        res.status(400).json({
            message:err.message
        })
    })
});



module.exports=Router;